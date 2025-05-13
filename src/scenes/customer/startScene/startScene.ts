import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { messageSceneArtistId } from '@scenes/artist/messageScene';
import { choiceProductSceneId } from '@scenes/customer/choiceProductScene';
import { myOrdersSceneId } from '@scenes/customer/myOrdersScene';
import { myOrdersSceneConfig } from '@scenes/customer/myOrdersScene/myOrdersSceneConfig';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { startSceneConfig } from './startSceneConfig';

export const startSceneId = startSceneConfig.sceneId;
export const startScene = new Scenes.BaseScene<MyContext>(startSceneId);

startScene.enter(async (ctx) => {
	ctx.session.orderData = {};

	const { from } = ctx.scene.state as { from: string };

	// console.log(
	// 	await promocodeService.createPromocode({
	// 		code: 'test',
	// 		discountType: 'fixed',
	// 		discountValue: 100,
	// 		maxUses: 1,
	// 	})
	// );

	if (from === backButton.key) {
		await ctx.editMessageCaption(startSceneConfig.text, {
			reply_markup: getMenuKeyboard(startSceneConfig.keyboard).reply_markup,
		});
	} else {
		await ctx.replyWithPhoto(startSceneConfig.image, {
			caption: startSceneConfig.text,
			reply_markup: getMenuKeyboard(startSceneConfig.keyboard).reply_markup,
		});
	}
});

startScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === choiceProductSceneId) {
			await ctx.scene.enter(choiceProductSceneId);
		} else if (parsed === myOrdersSceneConfig.sceneId) {
			await ctx.scene.enter(myOrdersSceneId);
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneArtistId, { key: parsed });
		}
	}

	await ctx.answerCbQuery();
});

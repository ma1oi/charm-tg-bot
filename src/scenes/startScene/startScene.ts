import { messageSceneArtist, messageSceneArtistId } from '@scenes/artist/messageScene';
import { choiceProductSceneId } from '@scenes/choiceProductScene';
import { messageSceneId } from '@scenes/messageScene';
import { promocodeService } from '@services/promocode';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { startSceneConfig } from './startSceneConfig';

import { backButton } from '@/constsants/buttons';

export const startSceneId = startSceneConfig.sceneId;
export const startScene = new Scenes.BaseScene<Scenes.SceneContext>(startSceneId);

startScene.enter(async (ctx) => {
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

		console.log(key);

		const parsed = JSON.parse(key);

		console.log(55556, parsed);

		if (parsed === choiceProductSceneId) {
			console.log(1123312);
			await ctx.scene.enter(choiceProductSceneId);
		} else if (parsed.split('_')[0] === 'replyMessage') {
			console.log(9898, parsed);
			await ctx.scene.enter(messageSceneArtistId, { key: parsed });
		}
	}

	await ctx.answerCbQuery();
});

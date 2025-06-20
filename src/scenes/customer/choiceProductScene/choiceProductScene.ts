import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { messageSceneId } from '@scenes/customer/messageScene';
import { productDescriptionSceneId } from '@scenes/customer/productDescriptionScene/productDescriptionScene';
import { startSceneId } from '@scenes/customer/startScene';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { choiceProductSceneConfig as config } from './choiceProductSceneConfig';

export const choiceProductSceneId = config.sceneId;
export const choiceProductScene = new Scenes.BaseScene<MyContext>(choiceProductSceneId);

choiceProductScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		await ctx.deleteMessage();
		await ctx.replyWithPhoto(config.image, {
			caption: config.text,
			reply_markup: getMenuKeyboard(config.keyboard).reply_markup,
		});
	} else {
		await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
	}
});

choiceProductScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(startSceneId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		} else {
			ctx.session.orderData = {
				...ctx.session.orderData,
				product: parsed,
			};

			await ctx.scene.enter(productDescriptionSceneId, { from: key });
		}
	}

	await ctx.answerCbQuery();
});

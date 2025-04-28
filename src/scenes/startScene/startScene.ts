import { choiceProductSceneId } from '@scenes/choiceProductScene';
import { messageScene, messageSceneId } from '@scenes/messageScene';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { startSceneConfig } from './startSceneConfig';

import { backButton } from '@/constsants/buttons';

export const startSceneId = startSceneConfig.sceneId;
export const startScene = new Scenes.BaseScene<Scenes.SceneContext>(startSceneId);

startScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

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
		} else {
			console.log(9898, parsed);
			await ctx.scene.enter(messageSceneId, { key: parsed });
		}
	}

	await ctx.answerCbQuery();
});

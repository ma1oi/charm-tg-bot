import { Scenes } from 'telegraf';

import { choiceProductSceneConfig as config } from './choiceProductSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

const sceneName = 'choiceProduct';

export const choiceProductScene = new Scenes.BaseScene<Scenes.SceneContext>(sceneName);
export const choiceProductSceneId = config.sceneId;

choiceProductScene.enter(async (ctx) => {
	await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
});

choiceProductScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsedKey = JSON.parse(key);

		if (parsedKey === backButton.key) {
			// todo
			await ctx.scene.enter('start', { from: backButton.key });
		} else {
			console.log(JSON.parse(key));
		}
	}

	await ctx.answerCbQuery();
});

import { Scenes } from 'telegraf';

import { descriptionSkinOrderSceneConfig as config } from './descriptionSkinOrderSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';
import { startSceneConfig } from '@scenes/startScene/startSceneConfig';
import { orderProductSceneId } from '@scenes/orderProductScene';
import { enterPromocodeSkinOrderSceneId } from '@scenes/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';

export const descriptionSkinOrderSceneId = config.sceneId;

export const descriptionSkinOrderScene = new Scenes.BaseScene<Scenes.SceneContext>(descriptionSkinOrderSceneId);

descriptionSkinOrderScene.enter(async (ctx) => {
	await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });

});

descriptionSkinOrderScene.on('text', async (ctx) => {
	console.log(111222, ctx.text);
	await ctx.scene.enter(enterPromocodeSkinOrderSceneId);
})

descriptionSkinOrderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);
		console.log(parsed);

		if (parsed === backButton.key) {
			console.log(11111);
			await ctx.scene.enter(orderProductSceneId);
		}
	}

	await ctx.answerCbQuery();
});

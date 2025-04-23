import { MyContext } from '@myContext/myContext';
import { enterPromocodeSkinOrderSceneId } from '@scenes/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { Scenes } from 'telegraf';

import { enterPromocodeSkinOrderSceneConfig as config } from './enterPromocodeSkinOrderSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const paymentSkinOrderSceneId = config.sceneId;

export const paymentSkinOrderScene = new Scenes.BaseScene<MyContext>(paymentSkinOrderSceneId);

paymentSkinOrderScene.enter(async (ctx) => {
	await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
});

paymentSkinOrderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);
		console.log(parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(enterPromocodeSkinOrderSceneId);
		} else if (parsed === 'paid') {

		}
	}

	await ctx.answerCbQuery();
});

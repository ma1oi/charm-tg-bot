import { MyContext } from '@myContext/myContext';
import { descriptionSkinOrderSceneId } from '@scenes/descriptionSkinOrderScene';
import { orderProductSceneId } from '@scenes/orderProductScene';
import { Scenes } from 'telegraf';

import { enterPromocodeSkinOrderSceneConfig as config } from './enterPromocodeSkinOrderSceneConfig';

import { backButton, promocodeButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const enterPromocodeSkinOrderSceneId = config.sceneId;

export const enterPromocodeSkinOrderScene = new Scenes.BaseScene<MyContext>(enterPromocodeSkinOrderSceneId);

enterPromocodeSkinOrderScene.enter(async (ctx) => {
	await ctx.replyWithPhoto(config.image, {caption: config.text, reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
});

enterPromocodeSkinOrderScene.on('text', async (ctx) => {
	console.log(111222, ctx.text);

	ctx.session.orderData = {
		...ctx.session.orderData,
		promocode: ctx.message.text,
	};

})

enterPromocodeSkinOrderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);
		console.log(parsed);

		if (parsed === promocodeButton.key) {
			console.log(11111);
			await ctx.scene.enter(orderProductSceneId);
		} else if (parsed === backButton.key) {
			await ctx.scene.enter(descriptionSkinOrderSceneId);
		}
	}

	await ctx.answerCbQuery();
});

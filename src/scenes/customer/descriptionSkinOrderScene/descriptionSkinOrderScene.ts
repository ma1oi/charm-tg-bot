import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { enterPromocodeSkinOrderSceneId } from '@scenes/customer/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { messageSceneId } from '@scenes/customer/messageScene';
import { orderProductSceneId } from '@scenes/customer/orderProductScene';
import { startSceneId } from '@scenes/customer/startScene';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { descriptionSkinOrderSceneConfig as config } from './descriptionSkinOrderSceneConfig';

export const descriptionSkinOrderSceneId = config.sceneId;

export const descriptionSkinOrderScene = new Scenes.BaseScene<MyContext>(descriptionSkinOrderSceneId);

descriptionSkinOrderScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		if (config.image) {
			await ctx.replyWithPhoto(config.image, {
				caption: config.text,
				reply_markup: getMenuKeyboard(config.keyboard).reply_markup,
			});
		} else {
			await ctx.reply(config.text, {
				reply_markup: getMenuKeyboard(config.keyboard).reply_markup,
			});
		}
	} else {
		await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
	}
});

descriptionSkinOrderScene.on('text', async (ctx) => {
	if (ctx.message.text === '/start') {
		await ctx.scene.enter(startSceneId);
	} else {
		ctx.session.orderData = {
			...ctx.session.orderData,
			descriptionProduct: ctx.message.text,
		};

		await ctx.scene.enter(enterPromocodeSkinOrderSceneId);
	}
});

descriptionSkinOrderScene.on('photo', async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	ctx.session.orderData = {
		...ctx.session.orderData,
		descriptionProduct: ctx.text,
		descriptionProductFile: ctx.message.photo[0].file_id,
	};

	await ctx.scene.enter(enterPromocodeSkinOrderSceneId);
});

descriptionSkinOrderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(orderProductSceneId);
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

import { MyContext } from '@myContext/myContext';
import { Order } from '@prisma/client';
import { descriptionSkinOrderSceneId } from '@scenes/descriptionSkinOrderScene';
import { paymentSkinOrderSceneId } from '@scenes/paymentSkinOrderScene';
import { orderService } from '@services/orders';
import { userService } from '@services/user';
import { assertFrom } from '@utils/assertFrom';
import { Scenes } from 'telegraf';

import { enterPromocodeSkinOrderSceneConfig as config } from './enterPromocodeSkinOrderSceneConfig';

import { backButton, promocodeButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const enterPromocodeSkinOrderSceneId = config.sceneId;

export const enterPromocodeSkinOrderScene = new Scenes.BaseScene<MyContext>(enterPromocodeSkinOrderSceneId);

const createOrder = async (ctx: MyContext): Promise<Order> => {
	assertFrom(ctx);

	const orderData = ctx.session.orderData;
	const user = await userService.getUserByTuid(BigInt(ctx.from.id));

	if (!orderData.product) {
		throw new Error('Product name is undefined');
	}

	if (!orderData.descriptionProduct) {
		throw new Error('DescriptionProduct name is undefined');
	}

	return await orderService.createOrder({
		description: orderData.descriptionProduct,
		customerId: user.id,
		customerTuid: BigInt(ctx.from.id),
		nameProduct: orderData.product,
		promocode: orderData.promocode,
	});
};

enterPromocodeSkinOrderScene.enter(async (ctx) => {
	await ctx.replyWithPhoto(config.image, {
		caption: config.text,
		reply_markup: getMenuKeyboard(config.keyboard).reply_markup,
	});
});

enterPromocodeSkinOrderScene.on('text', async (ctx) => {
	console.log(111222, ctx.text);

	ctx.session.orderData = {
		...ctx.session.orderData,
		promocode: ctx.message.text,
	};

	await createOrder(ctx);

	// const orderData = ctx.session.orderData;
	//
	// // todo промокод есть или нет
	//
	// const user = await userService.getUserByTuid(BigInt(ctx.from.id));
	//
	// await orderService.createOrder({
	// 	description: orderData.descriptionProduct,
	// 	customerId: user.id,
	// 	customerTuid: BigInt(ctx.from.id),
	// 	nameProduct: orderData.product || '',
	// 	promocode: orderData.promocode || '',
	// });
});

enterPromocodeSkinOrderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);
		console.log(parsed);

		if (parsed === promocodeButton.key) {
			console.log(11111);

			const createdOrder = await createOrder(ctx);

			await ctx.scene.enter(paymentSkinOrderSceneId);
		} else if (parsed === backButton.key) {
			await ctx.scene.enter(descriptionSkinOrderSceneId);
		}
	}

	await ctx.answerCbQuery();
});

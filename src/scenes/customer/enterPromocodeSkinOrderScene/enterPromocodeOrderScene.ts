import { backButton, promocodeButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { DiscountType, Order } from '@prisma/client';
import { descriptionSkinOrderSceneId } from '@scenes/customer/descriptionSkinOrderScene';
import { paymentSkinOrderSceneId } from '@scenes/customer/paymentSkinOrderScene';
import { artistService } from '@services/artist';
import { orderService } from '@services/order';
import { promocodeService } from '@services/promocode';
import { userService } from '@services/user';
import { assertFrom } from '@utils/assertFrom';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { enterPromocodeSkinOrderSceneConfig as config } from './enterPromocodeSkinOrderSceneConfig';

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

	console.log(1111, orderData.chosenArtistName);

	const artist = await artistService.getArtistByName(orderData.chosenArtistName);

	console.log(334333, artist);

	const createdOrder = await orderService.createOrder({
		description: orderData.descriptionProduct,
		customerId: user.id,
		customerTuid: BigInt(ctx.from.id),
		nameProduct: orderData.product,
		promocode: orderData.promocode,
		artistId: artist.userId,
	});

	ctx.session.orderData = {
		...ctx.session.orderData,
		orderId: createdOrder.id,
	};

	// todo обнулять ctx.session.orderData
};

enterPromocodeSkinOrderScene.enter(async (ctx) => {
	await ctx.replyWithPhoto(config.image, {
		caption: config.text,
		reply_markup: getMenuKeyboard(config.keyboard).reply_markup,
	});
});

enterPromocodeSkinOrderScene.on('text', async (ctx) => {
	console.log(111222, ctx.text);

	// ctx.session.orderData = {
	// 	...ctx.session.orderData,
	// 	promocode: ctx.message.text,
	// };

	ctx.session.orderData = {
		...ctx.session.orderData,
		promocodeName: ctx.message.text,
	};

	const promocode = await promocodeService.getPromocodeByCode(ctx.message.text);

	if (Object.keys(promocode).length !== 0) {
		const user = await userService.getUserByTuid(BigInt(ctx.from.id));

		const usege = await promocodeService.getPromocodeUsage(user.id, promocode.id);
		console.log(usege);

		if (Object.keys(usege).length === 0) {
			if (promocode.usedCount < promocode.maxUses) {
				if (promocode.discountType === DiscountType.fixed) {
					ctx.session.orderData = {
						...ctx.session.orderData,
						promocode: promocode.discountValue.toString(),
					};
				} else if (promocode.discountType === DiscountType.percent) {
					ctx.session.orderData = {
						...ctx.session.orderData,
						promocode: promocode.discountValue + '%',
					};
				}
			} else {
				await ctx.sendMessage('кончились активации');
				await ctx.scene.reenter();
				return;
			}

			await createOrder(ctx);
			await ctx.scene.enter(paymentSkinOrderSceneId);
		} else {
			console.log('usage');
			await ctx.sendMessage('вы уже спользовалит');
			await ctx.scene.reenter();
		}

		// todo ровершка на использрование промокода этим же челом несколько раз
		// todo УБРАТЬ !!!!
		// todo добавлять в бд что использовал
		// todo добавлять 1 использование
	} else {
		ctx.session.orderData = {
			...ctx.session.orderData,
			promocode: undefined,
			promocodeName: undefined,
		};

		await ctx.sendMessage('промо не существует');
		await ctx.scene.reenter();
	}

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
			ctx.session.orderData = {
				...ctx.session.orderData,
				promocode: null,
				promocodeName: null,
			};
			await createOrder(ctx);
			await ctx.scene.enter(paymentSkinOrderSceneId);
		} else if (parsed === backButton.key) {
			await ctx.scene.enter(descriptionSkinOrderSceneId, { key: parsed });
		}
	}

	await ctx.answerCbQuery();
});

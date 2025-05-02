import { bot } from '@bot';
import { MyContext } from '@myContext/myContext';
import { OrderStatus } from '@prisma/client';
import { products } from '@scenes/choiceProductScene';
import { enterPromocodeSkinOrderSceneId } from '@scenes/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { startSceneId } from '@scenes/startScene';
import { artistService } from '@services/artist';
import { orderService } from '@services/orders';
import { userService } from '@services/user';
import { assertFrom } from '@utils/assertFrom';
import { Scenes } from 'telegraf';

import { paymentSkinOrderSceneConfig as config } from './paymentSkinOrderSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const paymentSkinOrderSceneId = config.sceneId;

export const paymentSkinOrderScene = new Scenes.BaseScene<MyContext>(paymentSkinOrderSceneId);

paymentSkinOrderScene.enter(async (ctx) => {
	assertFrom(ctx);

	const orderData = ctx.session.orderData;

	let amount: number;

	// todo в utils и в ордерпродукт
	const findProductById = (id: number) => {
		for (const row of products) {
			const found = row.find((product) => product.id === id);
			if (found) return found;
		}
		return null;
	};

	const productId = Number(ctx.session.orderData?.product?.split('_')[1]);

	const product = findProductById(productId);

	console.log(orderData.promocode);

	if (orderData.promocode) {
		const applyDiscount = (price: number, promocode?: string): number => {
			if (!promocode) return price;

			promocode = promocode.trim();

			if (promocode.endsWith('%')) {
				const percent = parseFloat(promocode.slice(0, -1));
				if (isNaN(percent)) return price;

				const discount = (price * percent) / 100;
				return Math.max(0, price - discount); // Не уходим в минус
			} else {
				const fixed = parseFloat(promocode);
				if (isNaN(fixed)) return price;

				return Math.max(0, price - fixed); // Не уходим в минус
			}
		};
		// todo
		amount = applyDiscount(product?.cost!, orderData.promocode);
	} else {
		amount = Number(product?.cost);
	}
	// todo
	await ctx.sendMessage(amount.toString() + ` (-${product?.cost - amount})`, {
		reply_markup: getMenuKeyboard(config.keyboard).reply_markup,
	});
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
			// todo обработка платежа

			const orderData = ctx.session.orderData;

			if (orderData?.orderId !== undefined) {
				const deletedArtist = await artistService.assignOrderToNextArtist(orderData.orderId);

				console.log(deletedArtist);

				if (deletedArtist) {
					const artist = await userService.getUserById(deletedArtist.artistId);

					await bot.telegram.sendMessage(Number(artist.tuid), `У тебя новый заказ!\n#id_${orderData.orderId}`);
				} else {
					const updatedOrder = await orderService.updateOrder({
						id: orderData.orderId,
						status: OrderStatus.pending,
					});

					console.log(updatedOrder);
				}

				await ctx.editMessageText('создан новый заказ');
				await ctx.scene.enter(startSceneId);
			}
		}
	}

	await ctx.answerCbQuery();
});

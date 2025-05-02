import { bot } from '@bot';
import { MyContext } from '@myContext/myContext';
import { OrderStatus } from '@prisma/client';
import { enterPromocodeSkinOrderSceneId } from '@scenes/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { startSceneId } from '@scenes/startScene';
import { artistService } from '@services/artist';
import { orderService } from '@services/orders';
import { userService } from '@services/user';
import { Scenes } from 'telegraf';

import { paymentSkinOrderSceneConfig as config } from './paymentSkinOrderSceneConfig';

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
			// todo обработка платежа

			const orderData = ctx.session.orderData;

			if (orderData?.orderId !== undefined) {
				const deletedArtist = await artistService.assignOrderToNextArtist(orderData.orderId);

				console.log(deletedArtist);

				if (deletedArtist) {
					const artist = await userService.getUserById(deletedArtist.artistId);

					await bot.telegram.sendMessage(Number(artist.tuid), `У тебя новый заказ!\nid_${orderData.orderId}`);
				} else {
					const updatedOrder = await orderService.updateOrder({
						id: orderData.orderId,
						status: OrderStatus.pending,
					});

					console.log(updatedOrder);
				}

				await ctx.editMessageCaption('создан новый заказ');
				await ctx.scene.enter(startSceneId);
			}
		}
	}

	await ctx.answerCbQuery();
});

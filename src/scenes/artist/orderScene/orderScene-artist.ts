import { backButton } from '@constsants/buttons';
import { Order } from '@prisma/client';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { messageSceneArtistId } from '@scenes/artist/messageScene';
import { submitSkinSceneArtistId } from '@scenes/artist/submitSkinScene';
import { orderService } from '@services/order';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { orderSceneConfigArtist } from './orderSceneConfig-artist';

export const ordersSceneArtistId = orderSceneConfigArtist.sceneId;
export const orderSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(ordersSceneArtistId);

let order_: Order;

orderSceneArtist.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { orderId } = ctx.scene.state as { orderId: number };
	const order = await orderService.getOrderById(orderId);

	order_ = order;

	const message = `id_${order.id}\n\nОписание: ${order.description}`;

	if (order.descriptionFileUrl) {
		await ctx.replyWithPhoto(order.descriptionFileUrl, {
			caption: message,
			reply_markup: getMenuKeyboard(orderSceneConfigArtist.keyboard).reply_markup,
		});
	} else {
		await ctx.reply(message, { reply_markup: getMenuKeyboard(orderSceneConfigArtist.keyboard).reply_markup });
	}
});

orderSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(getMyOrdersSceneArtistId);
		} else if (parsed === 'messageCustomer') {
			await ctx.scene.enter(messageSceneArtistId, { orderId: order_.id });
		} else if (parsed === 'submitSkin') {
			await ctx.scene.enter(submitSkinSceneArtistId, { orderId: order_.id });
		}
	}

	await ctx.answerCbQuery();
});

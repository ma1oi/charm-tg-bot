import { backButton } from '@constsants/buttons';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { messageSceneId } from '@scenes/customer/messageScene';
import { orderService } from '@services/order';
import { Scenes } from 'telegraf';

import { orderSceneConfig } from './orderSceneConfig';
import { OrderStatus } from '@prisma/client';
import { myOrdersSceneId } from '@scenes/customer/myOrdersScene';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { closeOrderSceneId } from '@scenes/customer/closeOrderScene';
import { startSceneId } from '@scenes/customer/startScene';

export const ordersSceneId = orderSceneConfig.sceneId;
export const orderScene = new Scenes.BaseScene<Scenes.SceneContext>(ordersSceneId);

orderScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { orderId } = ctx.scene.state as { orderId: number };
	const order = await orderService.getOrderById(orderId);

	const statusOrder = {
		'not_paid': 'не оплачен',
		'pending': 'ожидает художника',
		'in_progress': 'в работе',
		'done': 'выполнен'
	}

	let message = `#id_${order.id}\n\nОписание: ${order.description}\n\nСтатус: ${statusOrder[order.status]}`;

	if (order.status === OrderStatus.in_progress || order.status === OrderStatus.done) {
		if (order.skinFileUrl) {

			if ( order.status === OrderStatus.in_progress ) {
				message = message + '\n\nВам нужно закрыть заказ'

				await ctx.replyWithPhoto(order.skinFileUrl, { caption: message, reply_markup: getMenuKeyboard([
						{ type: 'callback', key: `closeOrder_${order.id}`, label: 'Закрыть заказ' },
						{ type: 'separator' },
						{ type: 'callback', key: backButton.key, label: backButton.label },
					]).reply_markup
				})

				return;
			} else {
				await ctx.replyWithPhoto(order.skinFileUrl, { caption: message })
			}
		} else {
			await ctx.editMessageCaption(message + '\n\nФайл скина недоступен. Обратитесь в поддержку');
		}
	} else {
		await ctx.editMessageCaption(message);
	}

	await ctx.scene.enter(startSceneId);
});

orderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(myOrdersSceneId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'closeOrder') {
			console.log(434343434);
			await ctx.scene.enter(closeOrderSceneId, { key: parsed });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

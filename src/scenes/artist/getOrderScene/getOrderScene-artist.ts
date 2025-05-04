import { OrderStatus } from '@prisma/client';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { artistService } from '@services/artist';
import { orderService } from '@services/order';
import { userService } from '@services/user';
import { Scenes } from 'telegraf';

import { getOrderSceneConfigArtist } from './getOrderSceneConfig-artist';

export const getOrderSceneArtistId = getOrderSceneConfigArtist.sceneId;
export const getOrderSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(getOrderSceneArtistId);

getOrderSceneArtist.enter(async (ctx) => {
	if (ctx.from === undefined) return;

	const artist = await userService.getUserByTuid(BigInt(ctx.from.id));

	const orders = await orderService.getAllActiveArtistOrders(artist.id);

	console.log(Object.values(orders).length);
	if (Object.values(orders).length >= 5) {
		await ctx.editMessageText('У вас есть 5 активных заказов');
		await ctx.scene.enter(getMyOrdersSceneArtistId);
		return;
	}

	const order = await orderService.getPendingOrder();

	let message = 'Произошла ошибка';

	if (order) {
		const updateOrder = await orderService.updateOrder({
			id: order.id,
			status: OrderStatus.in_progress,
			artistId: artist.id,
		});

		if (updateOrder) {
			message = `Новый заказ\nId заказа: #id_${order.id}\nОписание: ${order.description}`;

			await ctx.editMessageText(message);
			await ctx.scene.enter(getMyOrdersSceneArtistId);
			return;
		}
	} else {
		const added = await artistService.addArtistToQueue(artist.id);

		if (added) {
			message = 'Заказов нет. Вы встали в очередь';

			await ctx.editMessageText(message);
		} else {
			message = 'Произошла ошибка';

			await ctx.editMessageText(message);

			throw new Error(added);
		}
	}

	await ctx.scene.enter(heroSceneArtistId);
});

getOrderSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		const parsed = JSON.parse(key);

		console.log(55553, parsed);
	}

	await ctx.answerCbQuery();
});

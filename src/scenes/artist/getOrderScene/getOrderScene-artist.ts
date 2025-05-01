import { OrderStatus } from '@prisma/client';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { artistService } from '@services/artist';
import { orderService } from '@services/orders';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { getOrderSceneConfigArtist } from './getOrderSceneConfig-artist';

export const getOrderSceneArtistId = getOrderSceneConfigArtist.sceneId;
export const getOrderSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(getOrderSceneArtistId);

getOrderSceneArtist.enter(async (ctx) => {
	const order = await orderService.getPendingOrder();

	let message = 'Произошла ошибка';

	if (ctx.from === undefined) return;

	const artist = await userService.getUserByTuid(BigInt(ctx.from.id));

	if (order) {
		const updateOrder = await orderService.updateOrder({
			id: order.id,
			status: OrderStatus.in_progress,
			artistId: artist.id,
		});

		if (updateOrder) {
			message = `Id заказа: #id_${order.id}\nОписание: ${order.description}\nСтатус: в работе`;
		}
	} else {
		const added = await artistService.addArtistToQueue(artist.id);

		if (added) {
			message = 'Заказов нет. Вы встали в очередь';

			await ctx.sendMessage(message);
			await ctx.scene.enter(heroSceneArtistId);
			return;
		} else {
			message = 'Произошла ошибка';

			await ctx.sendMessage(message);
			await ctx.scene.enter(heroSceneArtistId);

			throw new Error(added);
		}
	}

	await ctx.editMessageText(message, {
		reply_markup: getMenuKeyboard(getOrderSceneConfigArtist.keyboard).reply_markup,
	});
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

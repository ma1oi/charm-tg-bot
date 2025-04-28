import { backButton } from '@constsants/buttons';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { ordersSceneArtistId } from '@scenes/artist/orderScene';
import { startSceneConfig } from '@scenes/startScene/startSceneConfig';
import { orderService } from '@services/orders';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { getMyOrdersSceneConfigArtist } from './getMyOrdersSceneConfig-artist';

import { KeyboardButton } from '@/types/keyboard';

export const getMyOrdersSceneArtistId = getMyOrdersSceneConfigArtist.sceneId;
export const getMyOrdersSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(getMyOrdersSceneArtistId);

getMyOrdersSceneArtist.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { from } = ctx.scene.state as { from: string };

	const artist = await userService.getUserByTuid(BigInt(ctx.from.id));

	console.log(artist, 9949494);

	const orders = await orderService.getAllActiveArtistOrders(artist.id);

	console.log(orders);

	let message = '';

	const keyboard: KeyboardButton[] = [];

	console.log(111, orders);

	Object.values(orders).forEach((order) => {
		message = message + `Ордер id_${order.id}\n\n`;
		keyboard.push({ type: 'callback', key: `order_${order.id}`, label: `id_${order.id}` }, { type: 'separator' });
	});

	keyboard.push({ type: 'callback', key: backButton.key, label: backButton.label });

	if (from === backButton.key) {
		await ctx.sendMessage(message, {
			reply_markup: getMenuKeyboard(keyboard).reply_markup,
		});
	} else {
		await ctx.editMessageText(message, {
			reply_markup: getMenuKeyboard(keyboard).reply_markup,
		});
	}
});

getMyOrdersSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		console.log(key);

		const parsed = JSON.parse(key);

		console.log(55552, parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(heroSceneArtistId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'order') {
			console.log(parsed.split('_')[1], 'idc');

			await ctx.scene.enter(ordersSceneArtistId, { orderId: Number(parsed.split('_')[1]) });
		} else {
			await ctx.scene.leave();
		}
	}

	await ctx.answerCbQuery();
});

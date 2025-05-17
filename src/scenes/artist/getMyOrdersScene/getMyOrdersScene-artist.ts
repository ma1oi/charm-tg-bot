import { backButton } from '@constsants/buttons';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { messageSceneArtistId } from '@scenes/artist/messageScene';
import { ordersSceneArtistId } from '@scenes/artist/orderScene';
import { orderService } from '@services/order';
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

	const orders = await orderService.getAllActiveArtistOrders(artist.id);

	let message = Object.values(orders).length === 0 ? 'У вас нет заказов' : 'Список ваших актиынх заказов:\n\n';

	const keyboard: KeyboardButton[] = [];

	Object.values(orders).forEach((order) => {
		message = message + `Заказ id_${order.id}\n\n`;
		keyboard.push({ type: 'callback', key: `order_${order.id}`, label: `id_${order.id}` }, { type: 'separator' });
	});

	keyboard.push({ type: 'callback', key: backButton.key, label: backButton.label });

	if (from === backButton.key) {
		await ctx.editMessageText(message, {
			reply_markup: getMenuKeyboard(keyboard).reply_markup,
		});
	} else {
		await ctx.sendMessage(message, {
			reply_markup: getMenuKeyboard(keyboard).reply_markup,
		});
	}
});

getMyOrdersSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(heroSceneArtistId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'order') {
			await ctx.scene.enter(ordersSceneArtistId, { orderId: Number(parsed.split('_')[1]) });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneArtistId, { key: parsed });
		}
	}

	await ctx.answerCbQuery();
});

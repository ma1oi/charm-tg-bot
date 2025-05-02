import { backButton } from '@constsants/buttons';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { messageSceneId } from '@scenes/messageScene';
import { startSceneId } from '@scenes/startScene';
import { orderService } from '@services/orders';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { orderSceneConfig } from './orderSceneConfig';

export const ordersSceneId = orderSceneConfig.sceneId;
export const orderScene = new Scenes.BaseScene<Scenes.SceneContext>(ordersSceneId);

orderScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { orderId } = ctx.scene.state as { orderId: number };

	console.log(18991919191, orderId);

	const order = await orderService.getOrderById(orderId);

	const message = `#id_${order.id}\n\nОписание: ${order.description}\n\nСтатус: ${order.status}`;

	await ctx.editMessageCaption(message);
	await ctx.scene.enter(startSceneId);
});

orderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		console.log(key);

		const parsed = JSON.parse(key);

		console.log(55554, parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(getMyOrdersSceneArtistId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			console.log(9898, parsed);
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

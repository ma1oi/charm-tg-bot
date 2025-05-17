import { MyContext } from '@myContext/myContext';
import { messageSceneId } from '@scenes/customer/messageScene';
import { startSceneId } from '@scenes/customer/startScene';
import { orderService } from '@services/order';
import { assertFrom } from '@utils/assertFrom';
import { Scenes } from 'telegraf';

import { closeOrderSceneConfig as config } from './closeOrderSceneConfig';
import { OrderStatus } from '@prisma/client';

export const closeOrderSceneId = config.sceneId;

export const closeOrderScene = new Scenes.BaseScene<MyContext>(closeOrderSceneId);

closeOrderScene.enter(async (ctx) => {
	assertFrom(ctx);

	const { key } = ctx.scene.state as { key: string };

	const orderId = Number(key.split('_')[1]);

	const updateOrder = await orderService.updateOrder({
		id: orderId,
		status: OrderStatus.done,
		completedAt: new Date(),
	});

	await ctx.reply('Спасибо за заказ!');

	await ctx.scene.enter(startSceneId);
	await ctx.answerCbQuery();
});

closeOrderScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

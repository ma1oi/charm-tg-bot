import { MyContext } from '@myContext/myContext';
import { messageSceneId } from '@scenes/messageScene';
import { ordersSceneId } from '@scenes/orderScene';
import { startSceneId } from '@scenes/startScene';
import { orderService } from '@services/orders';
import { assertFrom } from '@utils/assertFrom';
import { Scenes } from 'telegraf';

import { myOrdersSceneConfig as config, myOrdersSceneConfig, myOrdersSceneConfigkeyboard } from './myOrdersSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const myOrdersSceneId = config.sceneId;

export const myOrdersScene = new Scenes.BaseScene<MyContext>(myOrdersSceneId);

myOrdersScene.enter(async (ctx) => {
	assertFrom(ctx);

	const orders = await orderService.getAllUsersOrdersByTuid(ctx.from.id);

	console.log(orders);

	await ctx.editMessageCaption(myOrdersSceneConfig.text, {
		reply_markup: getMenuKeyboard(myOrdersSceneConfigkeyboard(Object.values(orders), 0, 5).keyboard()).reply_markup,
	});
});

myOrdersScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);
		console.log(parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(startSceneId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'next' || parsed.split('_')[0] === 'prev') {
			const countPrev = Number(parsed.split('_')[1]);
			const countNext = Number(parsed.split('_')[2]);

			const orders = await orderService.getAllUsersOrdersByTuid(ctx.from.id);

			await ctx.editMessageCaption(myOrdersSceneConfig.text, {
				reply_markup: getMenuKeyboard(
					myOrdersSceneConfigkeyboard(Object.values(orders), countPrev, countNext).keyboard()
				).reply_markup,
			});
		} else if (parsed.split('_')[0] === 'orderId') {
			console.log(9898, parsed);
			await ctx.scene.enter(ordersSceneId, { orderId: Number(parsed.split('_')[1]) });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			console.log(9898, parsed);
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

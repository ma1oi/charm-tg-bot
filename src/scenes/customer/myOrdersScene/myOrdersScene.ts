import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { messageSceneId } from '@scenes/customer/messageScene';
import { ordersSceneId } from '@scenes/customer/orderScene';
import { startSceneId } from '@scenes/customer/startScene';
import { orderService } from '@services/order';
import { assertFrom } from '@utils/assertFrom';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { myOrdersSceneConfig as config, myOrdersSceneConfig, myOrdersSceneConfigkeyboard } from './myOrdersSceneConfig';

export const myOrdersSceneId = config.sceneId;

export const myOrdersScene = new Scenes.BaseScene<MyContext>(myOrdersSceneId);

myOrdersScene.enter(async (ctx) => {
	assertFrom(ctx);

	const { from } = ctx.scene.state as { from: string };

	const orders = await orderService.getAllUsersOrdersByTuid(ctx.from.id);

	if (from === backButton.key) {
		await ctx.reply(myOrdersSceneConfig.text, {
			reply_markup: getMenuKeyboard(myOrdersSceneConfigkeyboard(Object.values(orders).reverse(), 0, 5).keyboard()).reply_markup,
		});
	} else {
		await ctx.editMessageCaption(myOrdersSceneConfig.text, {
			reply_markup: getMenuKeyboard(myOrdersSceneConfigkeyboard(Object.values(orders).reverse(), 0, 5).keyboard()).reply_markup,
		});
	}
});

myOrdersScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(startSceneId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'next' || parsed.split('_')[0] === 'prev') {
			const countPrev = Number(parsed.split('_')[1]);
			const countNext = Number(parsed.split('_')[2]);

			const orders = await orderService.getAllUsersOrdersByTuid(ctx.from.id);

			await ctx.editMessageCaption(myOrdersSceneConfig.text, {
				reply_markup: getMenuKeyboard(
					myOrdersSceneConfigkeyboard(Object.values(orders).reverse(), countPrev, countNext).keyboard()
				).reply_markup,
			});
		} else if (parsed.split('_')[0] === 'orderId') {
			await ctx.scene.enter(ordersSceneId, { orderId: Number(parsed.split('_')[1]) });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

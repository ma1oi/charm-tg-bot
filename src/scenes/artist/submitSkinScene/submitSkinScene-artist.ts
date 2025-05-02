import { backButton } from '@constsants/buttons';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { startSceneConfig } from '@scenes/startScene/startSceneConfig';
import { orderService } from '@services/orders';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { submitSkinSceneConfigArtist } from './submitSkinSceneConfig-artist';

export const submitSkinSceneArtistId = submitSkinSceneConfigArtist.sceneId;
export const submitSkinSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(submitSkinSceneArtistId);

let orderId_: number;

submitSkinSceneArtist.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { orderId } = ctx.scene.state as { orderId: number };

	orderId_ = orderId;

	await ctx.editMessageText('отправь файл скина не в сжатом виде. После этого заказ будет закрыт с вашей стороны', {
		reply_markup: getMenuKeyboard([{ type: 'callback', key: backButton.key, label: backButton.label }]).reply_markup,
	});
});

submitSkinSceneArtist.on('document', async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	console.log(ctx);

	const order = await orderService.getOrderById(orderId_);

	const doneOrder = await orderService.updateOrder({
		id: order.id,
		// status: OrderStatus.done,
		skinFileUrl: ctx.message.document.file_id,
		// completedAt: new Date(),
	});

	console.log(111, doneOrder);

	await ctx.telegram.sendDocument(Number(order.customerTuid), ctx.message.document.file_id, {
		caption: `Ваш скин по заказу #id_${orderId_}`,
		reply_markup: getMenuKeyboard([
			{ type: 'callback', key: `closeOrder_${orderId_}`, label: 'Закрыть заказ' },
			...submitSkinSceneConfigArtist.keyboard,
		]).reply_markup,
	});

	await ctx.telegram.sendMessage(Number(order.customerTuid), startSceneConfig.text, {
		reply_markup: getMenuKeyboard(startSceneConfig.keyboard).reply_markup,
	});

	// todo статистика художника

	await ctx.reply(`Поздравляем! Вы выполнили заказ #id_${orderId_}`);

	await ctx.scene.enter(getMyOrdersSceneArtistId);
});

submitSkinSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		console.log(key);

		const parsed = JSON.parse(key);

		console.log(55551, parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(heroSceneArtistId, { from: backButton.key });
		}
	}

	await ctx.answerCbQuery();
});

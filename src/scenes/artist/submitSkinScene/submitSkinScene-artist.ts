import { backButton } from '@constsants/buttons';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { startSceneConfig } from '@scenes/customer/startScene/startSceneConfig';
import { orderService } from '@services/order';
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

	await ctx.editMessageText('Отправьте файл скина не в сжатом виде. После этого заказ будет закрыт с вашей стороны', {
		reply_markup: getMenuKeyboard([{ type: 'callback', key: backButton.key, label: backButton.label }]).reply_markup,
	});
});

submitSkinSceneArtist.on('photo', async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const order = await orderService.getOrderById(orderId_);
	const doneOrder = await orderService.updateOrder({
		id: order.id,
		skinFileUrl: ctx.message.photo[0].file_id,
	});

	await ctx.telegram.sendPhoto(Number(order.customerTuid), ctx.message.photo[0].file_id, {
		caption: `Ваш скин по заказу #id_${orderId_}`,
		reply_markup: getMenuKeyboard([
			{ type: 'callback', key: `closeOrder_${orderId_}`, label: 'Закрыть заказ' },
			...submitSkinSceneConfigArtist.keyboard,
		]).reply_markup,
	});

	await ctx.reply(`Поздравляем! Вы выполнили заказ #id_${orderId_}.\nОсталось дождаться подтверждения заказа от заказчика`);

	await ctx.scene.enter(getMyOrdersSceneArtistId);
});

submitSkinSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(heroSceneArtistId, { from: backButton.key });
		}
	}

	await ctx.answerCbQuery();
});

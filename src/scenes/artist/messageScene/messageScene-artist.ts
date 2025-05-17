import { bot } from '@bot';
import { backButton } from '@constsants/buttons';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { messageService } from '@services/message';
import { orderService } from '@services/order';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { messageSceneConfigArtist } from './messageSceneConfig-artist';
import { startSceneId } from '@scenes/customer/startScene';

export const messageSceneArtistId = messageSceneConfigArtist.sceneId;
export const messageSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(messageSceneArtistId);

let customerId_: bigint;
let orderId_: number;

messageSceneArtist.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { orderId, key } = ctx.scene.state as { orderId: number; key: string };

	orderId_ = orderId;

	orderId_ ??= Number(key.split('_')[1]);

	const order = await orderService.getOrderById(orderId_);

	customerId_ = order.customerTuid;

	if (orderId === undefined) {
		await ctx.sendMessage('Отправь сообщение заказчику', {
			reply_markup: getMenuKeyboard(messageSceneConfigArtist.keyboard).reply_markup,
		});
	} else {
		await ctx.editMessageText('Отправь сообщение заказчику', {
			reply_markup: getMenuKeyboard(messageSceneConfigArtist.keyboard).reply_markup,
		});
	}
});

messageSceneArtist.on('photo', async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const artist = await userService.getUserByTuid(BigInt(ctx.from.id));

	const createdMessage = await messageService.createMessage({
		orderId: orderId_,
		content: ctx.text,
		senderId: artist.id,
		fileUrl: ctx.message.photo[0].file_id
	});

	if (ctx.text) {
		await bot.telegram.sendPhoto(Number(customerId_), ctx.message.photo[0].file_id, { caption: ctx.text, reply_markup: getMenuKeyboard([
				{ type: 'callback', key: `replyMessage_${orderId_}`, label: 'Ответить на сообщение' },
			]).reply_markup,
		});
	} else {
		await bot.telegram.sendPhoto(Number(customerId_), ctx.message.photo[0].file_id, { reply_markup: getMenuKeyboard([
				{ type: 'callback', key: `replyMessage_${orderId_}`, label: 'Ответить на сообщение' },
			]).reply_markup,
		});
	}

	await ctx.reply('Сообщение было отправлено');

	await ctx.scene.enter(getMyOrdersSceneArtistId);})


messageSceneArtist.on('text', async (ctx) => {
	console.log(1111);
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	if (ctx.message.text === '/start') {
		await ctx.scene.enter(startSceneId)
		return
	} else if (ctx.message.text === '/artist') {
		await ctx.scene.enter(heroSceneArtistId)
		return
	}


	const artist = await userService.getUserByTuid(BigInt(ctx.from.id));

	await messageService.createMessage({
		orderId: orderId_,
		content: ctx.text,
		senderId: artist.id,
	});

	await bot.telegram.sendMessage(Number(customerId_), ctx.text, {
		reply_markup: getMenuKeyboard([
			{ type: 'callback', key: `replyMessage_${orderId_}`, label: 'Ответить на сообщение' },
		]).reply_markup,
	});

	await ctx.reply('Сообщение было отправлено');

	await ctx.scene.enter(getMyOrdersSceneArtistId);
});

messageSceneArtist.on('callback_query', async (ctx) => {
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

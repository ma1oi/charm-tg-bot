import { appConfig } from '@config/app';
import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { messageService } from '@services/message';
import { orderService } from '@services/order';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes, Telegraf } from 'telegraf';

import { messageSceneConfig } from './messageSceneConfig';

export const messageSceneId = messageSceneConfig.sceneId;
export const messageScene = new Scenes.BaseScene<Scenes.SceneContext>(messageSceneId);

const bot = new Telegraf<MyContext>(appConfig.botToken);

let artistTuid_: bigint;
let orderId_: number;
let fromScene_: string;

messageScene.enter(async (ctx) => {
	console.log(9493493993933);

	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { orderId, fromScene } = ctx.scene.state as { orderId: number; fromScene: string };

	orderId_ = orderId;
	fromScene_ = fromScene;

	if (typeof orderId_ !== 'number') {
		const { key } = ctx.scene.state as { key: string };
		orderId_ = Number(key.split('_')[1]);
	}

	const order = await orderService.getOrderById(orderId_);

	if (!order) return;

	const artist = await userService.getUserById(order.artistId!);

	if (!artist.tuid) return;

	artistTuid_ = BigInt(artist.tuid);

	await ctx.sendMessage(messageSceneConfig.text, {
		reply_markup: getMenuKeyboard(messageSceneConfig.keyboard).reply_markup,
	});
});

messageScene.on('text', async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const customer = await userService.getUserByTuid(BigInt(ctx.from.id));

	await messageService.createMessage({
		orderId: orderId_,
		content: ctx.text,
		senderId: customer.id,
	});

	await bot.telegram.sendMessage(Number(artistTuid_), ctx.text, {
		reply_markup: getMenuKeyboard([{ type: 'callback', key: 'replyMessage_4', label: 'Ответить на сообщение' }])
			.reply_markup,
	});

	await ctx.reply('Сообщение было отправлено\nМожете написать еще одно', {
		reply_markup: getMenuKeyboard(messageSceneConfig.keyboard).reply_markup,
	});
});

messageScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(fromScene_, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.reenter();
		}
	}

	await ctx.answerCbQuery();
});

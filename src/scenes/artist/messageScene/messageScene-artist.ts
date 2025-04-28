import { appConfig } from '@config/app';
import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { getOrderSceneArtistId } from '@scenes/artist/getOrderScene';
import { heroSceneArtistId } from '@scenes/artist/heroScene';
import { messageService } from '@services/message';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes, Telegraf } from 'telegraf';

import { messageSceneConfigArtist } from './messageSceneConfig-artist';

export const messageSceneArtistId = messageSceneConfigArtist.sceneId;
export const messageSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(messageSceneArtistId);

const bot = new Telegraf<MyContext>(appConfig.botToken);

let customerId_: bigint;
let orderId_: number;

messageSceneArtist.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { customerId, orderId } = ctx.scene.state as { customerId: bigint; orderId: number };

	customerId_ = customerId;
	orderId_ = orderId;

	console.log('customerId', customerId);

	await ctx.editMessageText('отправь сообщение', {
		reply_markup: getMenuKeyboard(messageSceneConfigArtist.keyboard).reply_markup,
	});
});

messageSceneArtist.on('text', async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}
	console.log(111222, ctx.text);

	const artist = await userService.getUserByTuid(BigInt(ctx.from.id));

	const createdMessage = await messageService.createMessage({
		orderId: orderId_,
		content: ctx.text,
		senderId: artist.id,
	});

	console.log(createdMessage);

	await bot.telegram.sendMessage(Number(customerId_), ctx.text, {
		reply_markup: getMenuKeyboard([
			{ type: 'callback', key: `replyMessage_${orderId_}`, label: 'Ответить на сообщение' },
		]).reply_markup,
	});

	await ctx.reply('Сообщение было отправлено');

	await ctx.scene.enter(getMyOrdersSceneArtistId, { from: backButton.key });
});

messageSceneArtist.on('callback_query', async (ctx) => {
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

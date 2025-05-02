import { appConfig } from '@config/app';
import { redisStore } from '@middlewares/redis';
import { upsertUserMiddleware } from '@middlewares/upsertUser';
import { MyContext } from '@myContext/myContext';
import { OrderStatus } from '@prisma/client';
import { getMyOrdersSceneArtist } from '@scenes/artist/getMyOrdersScene/getMyOrdersScene-artist';
import { getOrderSceneArtist } from '@scenes/artist/getOrderScene';
import { heroSceneArtist, heroSceneArtistId } from '@scenes/artist/heroScene';
import { messageSceneArtist } from '@scenes/artist/messageScene';
import { orderSceneArtist } from '@scenes/artist/orderScene';
import { submitSkinSceneArtist } from '@scenes/artist/submitSkinScene';
import { choiceProductScene } from '@scenes/choiceProductScene/choiceProductScene';
import { descriptionSkinOrderScene } from '@scenes/descriptionSkinOrderScene';
import { enterPromocodeSkinOrderScene } from '@scenes/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { messageScene, messageSceneId } from '@scenes/messageScene/messageScene';
import { orderProductScene } from '@scenes/orderProductScene';
import { paymentSkinOrderScene } from '@scenes/paymentSkinOrderScene/';
import { orderService } from '@services/orders';
import { Scenes, session, Telegraf } from 'telegraf';

import { startScene, startSceneId } from '@/scenes/startScene';

export const bot = new Telegraf<MyContext>(appConfig.botToken);

const stage = new Scenes.Stage<MyContext>([
	startScene,
	choiceProductScene,
	orderProductScene,
	descriptionSkinOrderScene,
	enterPromocodeSkinOrderScene,
	paymentSkinOrderScene,
	messageScene,

	heroSceneArtist,
	getOrderSceneArtist,
	getMyOrdersSceneArtist,
	orderSceneArtist,
	messageSceneArtist,
	submitSkinSceneArtist,
]);

// @ts-ignore
bot.use(session<MyContext['session']>({ store: redisStore }));

bot.use(stage.middleware());
bot.use(upsertUserMiddleware);

bot.command('start', async (ctx) => {
	await ctx.scene.enter(startSceneId);
});

bot.command('artist', async (ctx) => {
	await ctx.scene.enter(heroSceneArtistId);
});

bot.on('callback_query', async (ctx) => {
	if (!('data' in ctx.callbackQuery)) return;

	const key = JSON.parse(ctx.callbackQuery.data);

	if (key.split('_')[0] === 'replyMessage') {
		console.log(ctx.scene.current?.id, 'ctx.scene.current?.id');
		await ctx.answerCbQuery();
		await ctx.scene.enter(messageSceneId, {
			orderId: Number(key.split('_')[1]),
			fromScene: ctx.scene.current?.id,
		});
	} else if (key.split('_')[0] === 'closeOrder') {
		// todo не работает

		const order = Number(key.split('_')[1]);

		const updateOrder = await orderService.updateOrder({
			id: order,
			status: OrderStatus.done,
			completedAt: new Date(),
		});

		console.log(updateOrder, 'updateOrder');

		await ctx.reply('Спасибо за заказ!');

		await ctx.scene.enter(startSceneId);
		await ctx.answerCbQuery();
	}
});

void (async () => {
	await bot.launch({ dropPendingUpdates: true }, () => {
		console.log('🎉 Бот запущен!');
	});
})();

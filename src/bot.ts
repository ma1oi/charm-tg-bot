import { appConfig } from '@config/app';
import { errorHandler } from '@middlewares/errorHandler';
import { redisStore } from '@middlewares/redis';
import { upsertUserMiddleware } from '@middlewares/upsertUser';
import { MyContextWizard } from '@myContext/myContext';
import { allArtistsSceneAdmin } from '@scenes/admin/allArtistsScene';
import { artistAdminScene } from '@scenes/admin/artistScene';
import { closeOrderAdminScene } from '@scenes/admin/closeOrderScene';
import { createPromocodeSceneAdmin } from '@scenes/admin/createPromocodeScene';
import { heroSceneAdmin, heroSceneAdminId } from '@scenes/admin/heroScene';
import { hireArtistAdminScene } from '@scenes/admin/hireScene';
import { promocodeAdminScene } from '@scenes/admin/promocodeScene';
import { promocodesSceneAdmin } from '@scenes/admin/promocodesScene';
import { transferOrderToArtistAdminScene } from '@scenes/admin/transferOrderToArtistScene';
import { getMyOrdersSceneArtist } from '@scenes/artist/getMyOrdersScene/getMyOrdersScene-artist';
import { getOrderSceneArtist } from '@scenes/artist/getOrderScene';
import { heroSceneArtist, heroSceneArtistId } from '@scenes/artist/heroScene';
import { messageSceneArtist } from '@scenes/artist/messageScene';
import { orderSceneArtist } from '@scenes/artist/orderScene';
import { submitSkinSceneArtist } from '@scenes/artist/submitSkinScene';
import { choiceProductScene } from '@scenes/customer/choiceProductScene/choiceProductScene';
import { closeOrderScene } from '@scenes/customer/closeOrderScene';
import { enterPromocodeSkinOrderScene } from '@scenes/customer/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { messageScene, messageSceneId } from '@scenes/customer/messageScene/messageScene';
import { myOrdersScene } from '@scenes/customer/myOrdersScene/';
import { paymentSkinOrderScene } from '@scenes/customer/paymentSkinOrderScene/';
import { productDescriptionScene } from '@scenes/customer/productDescriptionScene/productDescriptionScene';
import { artistsAdminScene } from 'src/scenes/admin/artistsScene';
import { descriptionSkinOrderScene } from 'src/scenes/customer/descriptionSkinOrderScene';
import { orderProductScene } from 'src/scenes/customer/orderProductScene';
import { orderScene } from 'src/scenes/customer/orderScene';
import { startScene, startSceneId } from 'src/scenes/customer/startScene';
import { Scenes, session, Telegraf } from 'telegraf';

export const bot = new Telegraf<MyContextWizard>(appConfig.botToken);

// @ts-ignore
const stage = new Scenes.Stage<MyContextWizard>([
	startScene,
	choiceProductScene,
	orderProductScene,
	descriptionSkinOrderScene,
	enterPromocodeSkinOrderScene,
	paymentSkinOrderScene,
	messageScene,
	myOrdersScene,
	orderScene,
	productDescriptionScene,
	closeOrderScene,

	heroSceneArtist,
	getOrderSceneArtist,
	getMyOrdersSceneArtist,
	orderSceneArtist,
	messageSceneArtist,
	submitSkinSceneArtist,

	heroSceneAdmin,
	createPromocodeSceneAdmin,
	promocodesSceneAdmin,
	promocodeAdminScene,
	artistsAdminScene,
	allArtistsSceneAdmin,
	artistAdminScene,
	hireArtistAdminScene,
	transferOrderToArtistAdminScene,
	closeOrderAdminScene,
]);

// @ts-ignore
bot.use(session<MySessionWizard>({ store: redisStore, defaultSession: () => ({}) }));

bot.use(errorHandler);
bot.use(upsertUserMiddleware);

bot.use(stage.middleware());

bot.command('/start', async (ctx) => {
	await ctx.scene.enter(startSceneId);
});

bot.command('artist', async (ctx) => {
	await ctx.scene.enter(heroSceneArtistId);
});

bot.command('admin', async (ctx) => {
	await ctx.scene.enter(heroSceneAdminId);
});

bot.on('text', async (ctx) => {
	await ctx.scene.enter(startSceneId);
});

bot.on('callback_query', async (ctx) => {
	if (!('data' in ctx.callbackQuery)) return;

	const key = JSON.parse(ctx.callbackQuery.data);

	if (key.split('_')[0] === 'replyMessage') {
		await ctx.answerCbQuery();
		await ctx.scene.enter(messageSceneId, {
			orderId: Number(key.split('_')[1]),
			fromScene: ctx.scene.current?.id,
		});
	}
});

void (async () => {
	await bot.launch({ dropPendingUpdates: true }, () => {
		console.log('🎉 Бот запущен!');
	});
})();

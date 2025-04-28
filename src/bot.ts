import { appConfig } from '@config/app';
import { upsertUserMiddleware } from '@middlewares/upsertUser';
import { MyContext } from '@myContext/myContext';
import { getMyOrdersSceneArtist } from '@scenes/artist/getMyOrdersScene/getMyOrdersScene-artist';
import { getOrderSceneArtist } from '@scenes/artist/getOrderScene';
import { heroSceneArtist, heroSceneArtistId } from '@scenes/artist/heroScene';
import { choiceProductScene } from '@scenes/choiceProductScene/choiceProductScene';
import { descriptionSkinOrderScene } from '@scenes/descriptionSkinOrderScene';
import { enterPromocodeSkinOrderScene } from '@scenes/enterPromocodeSkinOrderScene/enterPromocodeOrderScene';
import { orderProductScene } from '@scenes/orderProductScene';
import { paymentSkinOrderScene } from '@scenes/paymentSkinOrderScene/';
import { Scenes, Telegraf } from 'telegraf';

import { sessionMiddleware } from '@/middlewares/session';
import { startScene, startSceneId } from '@/scenes/startScene';

const bot = new Telegraf<MyContext>(appConfig.botToken);

const stage = new Scenes.Stage<MyContext>([
	startScene,
	choiceProductScene,
	orderProductScene,
	descriptionSkinOrderScene,
	enterPromocodeSkinOrderScene,
	paymentSkinOrderScene,

	heroSceneArtist,
	getOrderSceneArtist,
	getMyOrdersSceneArtist,
]);

bot.use(sessionMiddleware);
bot.use(stage.middleware());

bot.use(upsertUserMiddleware);

bot.command('start', async (ctx) => {
	await ctx.scene.enter(startSceneId);
});

bot.command('artist', async (ctx) => {
	await ctx.scene.enter(heroSceneArtistId);
});

void (async () => {
	await bot.launch({ dropPendingUpdates: true }, () => {
		console.log('🎉 Бот запущен!');
	});
})();

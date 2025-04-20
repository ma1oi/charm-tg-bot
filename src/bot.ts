import { appConfig } from '@config/app';
import { prisma } from '@config/database';
import { User } from '@prisma/client';
import { choiceProductScene } from '@scenes/choiceProductScene/choiceProductScene';
import { Scenes, Telegraf } from 'telegraf';

import { sessionMiddleware } from '@/middlewares/session';
import { startScene, startSceneId } from '@/scenes/startScene';

const bot = new Telegraf<Scenes.SceneContext>(appConfig.botToken);

const stage = new Scenes.Stage([startScene, choiceProductScene]);

bot.use(sessionMiddleware);
bot.use(stage.middleware());

bot.command('start', (ctx) => ctx.scene.enter(startSceneId));

void (async () => {
	// const user = await prisma.user.create({
	// 	data: {
	// 		isPremium: false,
	// 		name: 'asdsNikiaa',
	// 		tuid: 123213n,
	// 		username: 'asdsNikiaa',
	// 		languageCode: 'ru',
	// 	},
	// });
	// const users: User[] = await prisma.user.findMany();
	// console.log(users);
})();

void (async () => {
	await bot.launch({ dropPendingUpdates: true }, () => {
		console.log('🎉 Бот запущен!');
	});
})();

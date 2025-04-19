import { Telegraf, Scenes } from 'telegraf';
import { config } from 'dotenv';
import { sessionMiddleware } from './middlewares/session';
import startScene from './scenes/startScene.ts';

config();

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN не найден в .env');
}

const bot = new Telegraf<Scenes.SceneContext>(token);

const stage = new Scenes.Stage([startScene]);

bot.use(sessionMiddleware);
bot.use(stage.middleware());

bot.command('start', (ctx) => ctx.scene.enter('start'));

bot.launch({dropPendingUpdates: true}).then(() => {
  console.log('Бот запущен')
});

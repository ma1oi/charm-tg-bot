import { Scenes } from 'telegraf';
import { getMenuKeyboard } from '../keyboards/getMenuKeyboard.ts';

const startScene = new Scenes.BaseScene<Scenes.SceneContext>('start');

startScene.enter(async (ctx) => {
  await ctx.replyWithPhoto('https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg', { caption: 'Выберите пункт меню:', reply_markup: getMenuKeyboard('start').reply_markup});
});

startScene.on('callback_query', async (ctx) => {
  const callback = ctx.callbackQuery;

  if ('data' in callback) {
    const key = callback.data;

    console.log(key)

  }

  await ctx.answerCbQuery();
});

export default startScene;

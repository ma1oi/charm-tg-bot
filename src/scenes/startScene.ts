import { Scenes } from 'telegraf';
import { getMenuKeyboard } from '../keyboards/getMenuKeyboard.ts';
import { scenesConfig } from "../config/scenesConfig.ts";

const startScene = new Scenes.BaseScene<Scenes.SceneContext>('start');

const scene = scenesConfig['start'];

startScene.enter(async (ctx) => {
  const {from} = ctx.scene.state as { from: string }

  if (from === 'back') {
    await ctx.editMessageCaption(scene.text, { reply_markup: getMenuKeyboard('start').reply_markup })
  } else {
    await ctx.replyWithPhoto(scene.image, { caption: scene.text, reply_markup: getMenuKeyboard('start').reply_markup})
  }
});

startScene.on('callback_query', async (ctx) => {
  const callback = ctx.callbackQuery;

  if ('data' in callback) {
    const key = callback.data;

    console.log(key)

    const parsed = JSON.parse(key)

    console.log(55555, parsed)

    if (parsed === 'choiceProduct') {
      console.log(1123312)
      await ctx.scene.enter('choiceProduct')
    }

  }

  await ctx.answerCbQuery();
});

export default startScene;

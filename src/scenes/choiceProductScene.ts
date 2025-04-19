import { Scenes } from 'telegraf';
import { getMenuKeyboard } from '../keyboards/getMenuKeyboard.ts';
import {scenesConfig} from "../config/scenesConfig.ts";

const sceneName = 'choiceProduct'

const choiceProductScene = new Scenes.BaseScene<Scenes.SceneContext>(sceneName);

const scene = scenesConfig[sceneName];

choiceProductScene.enter(async (ctx) => {
  await ctx.editMessageCaption(scene.text, { reply_markup: getMenuKeyboard(sceneName).reply_markup });
});

choiceProductScene.on('callback_query', async (ctx) => {
  const callback = ctx.callbackQuery;

  if ('data' in callback) {
    const key = callback.data;
    const parsedKey = JSON.parse(key)

    if (parsedKey === 'back') {
      await ctx.scene.enter('start', { from: 'back' })
    } else {
      console.log(222222, key)
      // const fixed = key.replace(/'/g, '"');

      // console.log(1111, fixed)

      console.log(JSON.parse(key))



    }
  }

  await ctx.answerCbQuery();
});

export default choiceProductScene;

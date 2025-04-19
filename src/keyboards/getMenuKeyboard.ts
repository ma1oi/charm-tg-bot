import { Markup } from 'telegraf';
import { scenesConfig, type SceneName} from './../config/scenesConfig.ts';

export const getMenuKeyboard = (sceneName: SceneName) => {

  const scene = scenesConfig[sceneName];

  const buttons = scene.keyboard.map((item) => {
    if (item.type === 'callback') {
      return [Markup.button.callback(item.label, item.key)];
    }
    if (item.type === 'url') {
      return [Markup.button.url(item.label, item.url)];
    }
    return []
  });

  return Markup.inlineKeyboard(buttons);
};

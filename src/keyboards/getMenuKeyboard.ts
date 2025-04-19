import { Markup } from 'telegraf';
import { scenesConfig, type SceneName} from './../config/scenesConfig.ts';

export const getMenuKeyboard = (sceneName: SceneName) => {

  const scene = scenesConfig[sceneName];
  const rows: ReturnType<typeof Markup.button.callback | typeof Markup.button.url>[][] = [];
  let currentRow: typeof rows[number] = [];

  for (const item of scene.keyboard) {
    if (item.type === 'separator') {
      if (currentRow.length) {
        rows.push(currentRow);
        currentRow = [];
      }
      continue;
    }

    console.log(rows)

    if (item.type === 'callback') {
      console.log(8484, typeof item.key)
      currentRow.push(Markup.button.callback(item.label, JSON.stringify(item.key)));
    } else if (item.type === 'url') {
      currentRow.push(Markup.button.url(item.label, item.url));
    }
  }

  if (currentRow.length) {
    rows.push(currentRow);
  }

  return Markup.inlineKeyboard(rows);
};

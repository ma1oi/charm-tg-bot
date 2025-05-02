import { MyContext } from '@myContext/myContext';
import { messageSceneId } from '@scenes/messageScene';
import { orderProductSceneId } from '@scenes/orderProductScene/orderProductScene';
import { startSceneId } from '@scenes/startScene';
import { Scenes } from 'telegraf';

import { choiceProductSceneConfig as config } from './choiceProductSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

const sceneName = 'choiceProduct';

export const choiceProductScene = new Scenes.BaseScene<MyContext>(sceneName);
export const choiceProductSceneId = config.sceneId;

choiceProductScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		await ctx.sendMessage(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
	} else {
		await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
	}
});

choiceProductScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		console.log(key);
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(startSceneId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			console.log(9898, parsed);
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		} else {
			console.log(777777, key);

			ctx.session.orderData = {
				...ctx.session.orderData,
				product: parsed,
			};

			await ctx.scene.enter(orderProductSceneId, { from: key });
		}
	}

	await ctx.answerCbQuery();
});

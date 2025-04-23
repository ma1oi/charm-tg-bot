import { MyContext } from '@myContext/myContext';
import { orderProductSceneId } from '@scenes/orderProductScene/orderProductScene';
import { Scenes } from 'telegraf';

import { choiceProductSceneConfig as config } from './choiceProductSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

const sceneName = 'choiceProduct';

export const choiceProductScene = new Scenes.BaseScene<MyContext>(sceneName);
export const choiceProductSceneId = config.sceneId;

choiceProductScene.enter(async (ctx) => {
	await ctx.editMessageCaption(config.text, { reply_markup: getMenuKeyboard(config.keyboard).reply_markup });
});

choiceProductScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		console.log(key);
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter('start', { from: backButton.key });
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

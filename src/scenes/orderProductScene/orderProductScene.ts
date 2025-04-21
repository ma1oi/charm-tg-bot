import { choiceProductSceneId, products } from '@scenes/choiceProductScene';
import { Scenes } from 'telegraf';

import { orderProductSceneConfig as config } from './orderProductSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';
import { startSceneConfig } from '@scenes/startScene/startSceneConfig';

export const orderProductSceneId = config.sceneId;

export const orderProductScene = new Scenes.BaseScene<Scenes.SceneContext>(orderProductSceneId);

orderProductScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

	const findProductById = (id: number) => {
		for (const row of products) {
			const found = row.find((product) => product.id === id);
			if (found) return found;
		}
		return null;
	};

	const product = findProductById(Number(JSON.parse(from).split('_')[1]))

	console.log(product);

	console.log(from, 398838);

	if (product !== null) {
		await ctx.editMessageMedia({media: product.image, type: 'photo', caption: product.name }, {reply_markup: getMenuKeyboard(config.keyboard, from).reply_markup})
	}
});

orderProductScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);
		console.log(parsed);

		if (parsed === backButton.key) {
			console.log(11111);
			await ctx.scene.enter(choiceProductSceneId);
		} else {
			console.log(11111, parsed);

		}
	}

	await ctx.answerCbQuery();
});

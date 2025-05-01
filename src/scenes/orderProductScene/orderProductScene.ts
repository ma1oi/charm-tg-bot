import { MyContext } from '@myContext/myContext';
import { choiceProductSceneId, products } from '@scenes/choiceProductScene';
import { descriptionSkinOrderSceneId } from '@scenes/descriptionSkinOrderScene';
import { messageSceneId } from '@scenes/messageScene';
import { Scenes } from 'telegraf';

import { orderProductSceneConfig as config } from './orderProductSceneConfig';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const orderProductSceneId = config.sceneId;

export const orderProductScene = new Scenes.BaseScene<MyContext>(orderProductSceneId);

orderProductScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

	const findProductById = (id: number) => {
		for (const row of products) {
			const found = row.find((product) => product.id === id);
			if (found) return found;
		}
		return null;
	};

	const productId = Number(ctx.session.orderData?.product?.split('_')[1]);

	const product = findProductById(productId);

	if (product !== null) {
		await ctx.editMessageMedia(
			{ media: product.image, type: 'photo', caption: product.name },
			{ reply_markup: getMenuKeyboard(config.keyboard, from).reply_markup }
		);
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
		} else if (parsed.split('_')[0] === 'replyMessage') {
			console.log(9898, parsed);
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		} else {
			console.log(11111, parsed);

			await ctx.scene.enter(descriptionSkinOrderSceneId);
		}
	}

	await ctx.answerCbQuery();
});

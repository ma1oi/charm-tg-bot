import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { choiceProductSceneId } from '@scenes/customer/choiceProductScene';
import { messageSceneId } from '@scenes/customer/messageScene';
import { orderProductSceneId } from '@scenes/customer/orderProductScene/orderProductScene';
import { productDescriptionSceneConfig } from '@scenes/customer/productDescriptionScene/productDescriptionSceneConfig';
import { artistService } from '@services/artist';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

export const productDescriptionSceneId = productDescriptionSceneConfig.sceneId;
export const productDescriptionScene = new Scenes.BaseScene<MyContext>(productDescriptionSceneId);

productDescriptionScene.enter(async (ctx) => {
	await ctx.deleteMessage();

	const orderData = ctx.session.orderData;
	const productName = orderData?.product?.split('_')[0];

	const product = await artistService.getCategoryByName(productName);

	await ctx.replyWithPhoto(product.imgUrl, {
		caption: product.description,
		reply_markup: getMenuKeyboard(productDescriptionSceneConfig.keyboard).reply_markup,
	});
});

productDescriptionScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		const parsed = JSON.parse(key);

		if (parsed === 'order') {
			await ctx.deleteMessage();
			await ctx.scene.enter(orderProductSceneId);
		} else if (parsed === backButton.key) {
			await ctx.scene.enter(choiceProductSceneId);
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

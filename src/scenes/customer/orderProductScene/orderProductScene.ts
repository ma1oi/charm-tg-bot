import { backButton } from '@constsants/buttons';
import { MyContext } from '@myContext/myContext';
import { choiceProductSceneId, products } from '@scenes/customer/choiceProductScene';
import { descriptionSkinOrderSceneId } from '@scenes/customer/descriptionSkinOrderScene';
import { messageSceneId } from '@scenes/customer/messageScene';
import { artistService } from '@services/artist';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { orderProductSceneConfig as config } from './orderProductSceneConfig';

import { BUTTON_TYPES } from '@/types/keyboard';

export const orderProductSceneId = config.sceneId;

export const orderProductScene = new Scenes.BaseScene<MyContext>(orderProductSceneId);

orderProductScene.enter(async (ctx) => {
	const { from } = ctx.scene.state as { from: string };

	const orderData = ctx.session.orderData;

	const findProductById = (id: number) => {
		for (const row of products) {
			const found = row.find((product) => product.id === id);
			if (found) return found;
		}
		return null;
	};

	const productId = Number(orderData?.product?.split('_')[1]);

	const product = findProductById(productId);

	const artists = await artistService.getArtistsByCategory(orderData?.product?.split('_')[0].toLowerCase());

	console.log(555, Object.values(artists), orderData?.product?.split('_')[0].toLowerCase());
	artists.map((a) => {
		console.log(45, a);
	});

	if (product !== null) {
		const mediaGroup = artists.map((artist, i) => ({
			type: 'photo',
			media: artist.imgUrl,
			caption: i === 0 ? product.name : undefined,
		}));

		await ctx.replyWithMediaGroup(mediaGroup);

		await ctx.reply('выбери художника', {
			reply_markup: getMenuKeyboard(
				artists.map((artist, i) => ({
					type: BUTTON_TYPES.CALLBACK,
					key: `artist_${artist.name}`,
					label: artist.name,
				}))
			).reply_markup,
		});
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
		} else if (parsed.split('_')[0] === 'artist') {
			console.log(9898, parsed);

			ctx.session.orderData = {
				...ctx.session.orderData,
				chosenArtistName: parsed.split('_')[1],
			};

			await ctx.scene.enter(descriptionSkinOrderSceneId, { from: backButton.key });
		}
	}

	await ctx.answerCbQuery();
});

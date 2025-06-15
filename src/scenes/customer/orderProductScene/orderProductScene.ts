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

	if (product !== null) {
		const mediaGroup = artists.map((artist, i) => ({
			type: 'photo',
			media: artist.imgUrl,
			caption: i === 0 ? 'Категория: ' + product.name : undefined,
		}));

		if (mediaGroup.length === 1) {
			await ctx.replyWithPhoto(mediaGroup[0].media);
			return;
		}

		await ctx.replyWithMediaGroup(mediaGroup);

		if (artists.length === 0) {
			await ctx.reply('На данный момент нет доступных художников.');
			return;
		}

		await ctx.reply('Выберите художника', {
			reply_markup: getMenuKeyboard([
				...artists.map((artist) => ({
					type: BUTTON_TYPES.CALLBACK,
					key: `artist_${encodeURIComponent(artist.name)}`,
					label: artist.name,
				})),
				{
					type: BUTTON_TYPES.SEPARATOR,
				},
				{
					type: BUTTON_TYPES.CALLBACK,
					key: backButton.key,
					label: backButton.label,
				},
			]).reply_markup,
		});
	}
});

orderProductScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.deleteMessage();
			await ctx.scene.enter(choiceProductSceneId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		} else if (parsed.split('_')[0] === 'artist') {
			const arist = await artistService.getArtistByName(parsed.split('_')[1]);

			if (Object.keys(arist).length === 0) {
				await ctx.answerCbQuery('Художник недоступен. Произошла ошибка. Попробуйте выбрать другого художника');
				return;
			}

			ctx.session.orderData = {
				...ctx.session.orderData,
				chosenArtistName: parsed.split('_')[1],
			};

			await ctx.editMessageText(`Вы выбрали художника ${parsed.split('_')[1]}`);

			await ctx.scene.enter(descriptionSkinOrderSceneId, { from: backButton.key });
		}
	}

	await ctx.answerCbQuery();
});

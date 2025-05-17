import { bot } from '@bot';
import { backButton } from '@constsants/buttons';
import { artistsAdminSceneId } from '@scenes/admin/artistsScene';
import { orderService } from '@services/order';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { transferOrderToArtistSceneConfigAdmin } from './transferOrderToArtistSceneConfig-admin';

export const transferOrderToArtistAdminSceneId = transferOrderToArtistSceneConfigAdmin.sceneId;
export const transferOrderToArtistAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(
	transferOrderToArtistAdminSceneId
);

transferOrderToArtistAdminScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	await ctx.editMessageText(transferOrderToArtistSceneConfigAdmin.text, {
		reply_markup: getMenuKeyboard(transferOrderToArtistSceneConfigAdmin.keyboard).reply_markup,
	});
});

transferOrderToArtistAdminScene.on('text', async (ctx) => {
	const orderId = Number(ctx.text.split(' ')[0]);
	const artistTuid = BigInt(ctx.text.split(' ')[1]);

	const artist = await userService.getUserByTuid(artistTuid);

	const editedOrder = await orderService.updateOrder({
		id: orderId,
		artistId: artist.id,
	});

	await bot.telegram.sendMessage(Number(artist.tuid), `Вам был передан заказ id_${orderId}`);

	await ctx.reply(`Художнику @${artist.username}, id_${artist.id} был передан заказ id_${orderId}`);
	await ctx.scene.enter(artistsAdminSceneId, { from: backButton.key });
});

transferOrderToArtistAdminScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(artistsAdminSceneId);
		}
	}

	await ctx.answerCbQuery();
});

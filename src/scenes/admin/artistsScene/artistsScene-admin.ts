import { backButton } from '@constsants/buttons';
import { allArtistsAdminSceneId } from '@scenes/admin/allArtistsScene';
import { closeOrderAdminSceneId } from '@scenes/admin/closeOrderScene';
import { heroSceneAdminId } from '@scenes/admin/heroScene';
import { hireArtistAdminSceneId } from '@scenes/admin/hireScene';
import { transferOrderToArtistAdminSceneId } from '@scenes/admin/transferOrderToArtistScene';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { artistsSceneConfigAdmin } from './artistsSceneConfig-admin';

export const artistsAdminSceneId = artistsSceneConfigAdmin.sceneId;
export const artistsAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(artistsAdminSceneId);

artistsAdminScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		await ctx.sendMessage(artistsSceneConfigAdmin.text, {
			reply_markup: getMenuKeyboard(artistsSceneConfigAdmin.keyboard).reply_markup,
		});
	} else {
		await ctx.editMessageText(artistsSceneConfigAdmin.text, {
			reply_markup: getMenuKeyboard(artistsSceneConfigAdmin.keyboard).reply_markup,
		});
	}
});

artistsAdminScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		console.log(key);

		const parsed = JSON.parse(key);

		console.log(55554, parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(heroSceneAdminId, { from: backButton.key });
		} else if (parsed === 'allArtists') {
			await ctx.scene.enter(allArtistsAdminSceneId);
		} else if (parsed === 'hireArtists') {
			await ctx.scene.enter(hireArtistAdminSceneId);
		} else if (parsed === 'transferOrderToArtist') {
			await ctx.scene.enter(transferOrderToArtistAdminSceneId);
		} else if (parsed === 'closeOrder') {
			await ctx.scene.enter(closeOrderAdminSceneId);
		}
	}

	await ctx.answerCbQuery();
});

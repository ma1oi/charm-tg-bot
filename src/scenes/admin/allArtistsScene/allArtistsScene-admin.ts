import { MyContext } from '@myContext/myContext';
import { artistsAdminSceneId } from '@scenes/admin/artistsScene';
import { artistService } from '@services/artist';
import { artistAdminSceneId } from 'src/scenes/admin/artistScene';
import { messageSceneId } from 'src/scenes/customer/messageScene';
import { Scenes } from 'telegraf';

import {
	allArtistsAdminSceneConfigkeyboard,
	allArtistsSceneConfigAdmin,
	allArtistsSceneConfigAdmin as config,
} from './allArtistsSceneConfig-admin';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const allArtistsAdminSceneId = config.sceneId;
export const allArtistsSceneAdmin = new Scenes.BaseScene<MyContext>(allArtistsAdminSceneId);

allArtistsSceneAdmin.enter(async (ctx) => {
	const artists = await artistService.getAllArtists();

	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		await ctx.sendMessage(allArtistsSceneConfigAdmin.text, {
			reply_markup: getMenuKeyboard(
				allArtistsAdminSceneConfigkeyboard(Object.values(artists).reverse(), 0, 5).keyboard()
			).reply_markup,
		});
	} else {
		await ctx.editMessageText(allArtistsSceneConfigAdmin.text, {
			reply_markup: getMenuKeyboard(
				allArtistsAdminSceneConfigkeyboard(Object.values(artists).reverse(), 0, 5).keyboard()
			).reply_markup,
		});
	}
});

allArtistsSceneAdmin.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(artistsAdminSceneId);
		} else if (parsed.split('_')[0] === 'next' || parsed.split('_')[0] === 'prev') {
			const countPrev = Number(parsed.split('_')[1]);
			const countNext = Number(parsed.split('_')[2]);

			const artists = await artistService.getAllArtists();

			await ctx.editMessageText(allArtistsSceneConfigAdmin.text, {
				reply_markup: getMenuKeyboard(
					allArtistsAdminSceneConfigkeyboard(Object.values(artists), countPrev, countNext).keyboard()
				).reply_markup,
			});
		} else if (parsed.split('_')[0] === 'artistId') {
			await ctx.scene.enter(artistAdminSceneId, { artistId: Number(parsed.split('_')[1]) });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

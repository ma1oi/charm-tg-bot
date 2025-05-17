import { backButton } from '@constsants/buttons';
import { allArtistsAdminSceneId } from '@scenes/admin/allArtistsScene';
import { artistService } from '@services/artist';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { artistSceneConfig } from './artistSceneConfig';

export const artistAdminSceneId = artistSceneConfig.sceneId;
export const artistAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(artistAdminSceneId);

artistAdminScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { artistId } = ctx.scene.state as { artistId: number };

	const artist = await userService.getUserById(artistId);

	const countDoneOrdersArtist = await artistService.getCountAllDoneOrderArtist(artistId);

	const message = `Имя: ${artist.name}\nЮзернейм: ${artist.username === '' ? 'нет' : '@' + artist.username}\nВнутренний id: ${artist.id}\nТг id: ${artist.tuid}\nКолчистево выполненных заказов: ${countDoneOrdersArtist}`;

	await ctx.editMessageText(message, {
		reply_markup: getMenuKeyboard([
			{ type: 'callback', key: `dismissArtist_${artist.id}`, label: 'Снять художника' },
			{ type: 'separator' },
			...artistSceneConfig.keyboard,
		]).reply_markup,
		parse_mode: 'MarkdownV2',
	});
});

artistAdminScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(allArtistsAdminSceneId);
		} else if (parsed.split('_')[0] === 'dismissArtist') {
			const artist = await userService.getUserById(Number(parsed.split('_')[1]));


			if (artist.tuid) {
				const dismissedArtist = await artistService.dismissAndHireArtist(BigInt(artist.tuid), 'dismiss');

				await ctx.editMessageText(
					`${dismissedArtist.name}, @${dismissedArtist.username}, id_${dismissedArtist.id} был снят с должности художника`
				);

				await ctx.scene.enter(allArtistsAdminSceneId, { from: backButton.key });
			} else {
				throw new Error('artist.tuid = undefined');
			}

		}
	}

	await ctx.answerCbQuery();
});

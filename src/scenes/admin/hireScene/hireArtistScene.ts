import { backButton } from '@constsants/buttons';
import { artistsAdminSceneId } from '@scenes/admin/artistsScene';
import { artistService } from '@services/artist';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { hireArtistSceneConfig } from './hireArtistSceneConfig';

export const hireArtistAdminSceneId = hireArtistSceneConfig.sceneId;
export const hireArtistAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(hireArtistAdminSceneId);

hireArtistAdminScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	await ctx.editMessageText(hireArtistSceneConfig.text, {
		reply_markup: getMenuKeyboard(hireArtistSceneConfig.keyboard).reply_markup,
	});
});

hireArtistAdminScene.on('text', async (ctx) => {
	const hidedActor = await artistService.dismissAndHireArtist(BigInt(ctx.text), 'hire');

	await ctx.sendMessage(`Художник @${hidedActor.username}, id_${hidedActor.id} был нанят`);
	await ctx.scene.enter(artistsAdminSceneId, { from: backButton.key });
});

hireArtistAdminScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		console.log(key);

		const parsed = JSON.parse(key);

		console.log(55554, parsed);

		if (parsed === backButton.key) {
			await ctx.scene.enter(artistsAdminSceneId);
		}
	}

	await ctx.answerCbQuery();
});

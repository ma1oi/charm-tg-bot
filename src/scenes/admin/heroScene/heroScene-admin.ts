import { Role } from '@prisma/client';
import {
	createPromocodeSceneAdmin,
	createPromocodeSceneAdminId,
	createPromocodeSceneId,
} from '@scenes/admin/createPromocodeScene/createPromocodeScene-admin';
import { promocodesAdminSceneId, promocodesSceneAdmin } from '@scenes/admin/promocodesScene';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene/getMyOrdersScene-artist';
import { getOrderSceneArtistId } from '@scenes/artist/getOrderScene';
import { startSceneId } from '@scenes/startScene';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { heroSceneConfigAdmin } from './heroSceneConfig-admin';

import { backButton } from '@/constsants/buttons';

export const heroSceneAdminId = heroSceneConfigAdmin.sceneId;
export const heroSceneAdmin = new Scenes.BaseScene<Scenes.SceneContext>(heroSceneAdminId);

heroSceneAdmin.enter(async (ctx) => {
	if (ctx.from === undefined) {
		throw new Error('Ctx.from is undefined');
	}

	const user = await userService.getUserByTuid(BigInt(ctx.from.id));

	if (user.role !== Role.admin) {
		return await ctx.scene.enter(startSceneId);
	}

	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		await ctx.editMessageText(heroSceneConfigAdmin.text, {
			reply_markup: getMenuKeyboard(heroSceneConfigAdmin.keyboard).reply_markup,
		});
	} else {
		await ctx.reply(heroSceneConfigAdmin.text, {
			reply_markup: getMenuKeyboard(heroSceneConfigAdmin.keyboard).reply_markup,
		});
	}
});

heroSceneAdmin.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		const parsed = JSON.parse(key);

		// console.log(5555599, parsed);

		if (parsed === 'createPromocode') {
			await ctx.scene.enter(createPromocodeSceneAdminId);
		} else if (parsed === promocodesAdminSceneId) {
			console.log(1231);
			await ctx.scene.enter(promocodesAdminSceneId);
		}

		// if (parsed === choiceProductSceneId) {
		// 	console.log(1123312);
		// 	await ctx.scene.enter(choiceProductSceneId);
		// }
	}

	await ctx.answerCbQuery();
});

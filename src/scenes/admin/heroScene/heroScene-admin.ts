import { Role } from '@prisma/client';
import { createPromocodeSceneAdminId } from '@scenes/admin/createPromocodeScene/createPromocodeScene-admin';
import { promocodesAdminSceneId } from '@scenes/admin/promocodesScene';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { artistsAdminSceneId } from 'src/scenes/admin/artistsScene';
import { startSceneId } from 'src/scenes/customer/startScene';
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
		} else if (parsed === 'artists') {
			await ctx.scene.enter(artistsAdminSceneId);
		}

		// if (parsed === choiceProductSceneId) {
		// 	console.log(1123312);
		// 	await ctx.scene.enter(choiceProductSceneId);
		// }
	}

	await ctx.answerCbQuery();
});

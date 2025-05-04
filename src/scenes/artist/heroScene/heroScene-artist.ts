import { Role } from '@prisma/client';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene/getMyOrdersScene-artist';
import { getOrderSceneArtistId } from '@scenes/artist/getOrderScene';
import { userService } from '@services/user';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { startSceneId } from 'src/scenes/customer/startScene';
import { Scenes } from 'telegraf';

import { heroSceneConfigArtist } from './heroSceneConfig-artist';

import { backButton } from '@/constsants/buttons';

export const heroSceneArtistId = heroSceneConfigArtist.sceneId;
export const heroSceneArtist = new Scenes.BaseScene<Scenes.SceneContext>(heroSceneArtistId);

heroSceneArtist.enter(async (ctx) => {
	if (ctx.from === undefined) {
		throw new Error('Ctx.from is undefined');
	}

	const user = await userService.getUserByTuid(BigInt(ctx.from.id));

	if (user.role !== Role.artist) {
		return await ctx.scene.enter(startSceneId);
	}

	const { from } = ctx.scene.state as { from: string };

	if (from === backButton.key) {
		await ctx.editMessageText(heroSceneConfigArtist.text, {
			reply_markup: getMenuKeyboard(heroSceneConfigArtist.keyboard).reply_markup,
		});
	} else {
		await ctx.reply(heroSceneConfigArtist.text, {
			reply_markup: getMenuKeyboard(heroSceneConfigArtist.keyboard).reply_markup,
		});
	}
});

heroSceneArtist.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;

		const parsed = JSON.parse(key);

		// console.log(5555599, parsed);

		if (parsed === 'getNewOrder') {
			await ctx.scene.enter(getOrderSceneArtistId);
		} else if (parsed === 'getMyOrders') {
			console.log('jjjjjjjjjjj');
			await ctx.scene.enter(getMyOrdersSceneArtistId, { from: backButton.key });
		}

		// if (parsed === choiceProductSceneId) {
		// 	console.log(1123312);
		// 	await ctx.scene.enter(choiceProductSceneId);
		// }
	}

	await ctx.answerCbQuery();
});

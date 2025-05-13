import { MyContext } from '@myContext/myContext';
import { heroSceneAdminId } from '@scenes/admin/heroScene';
import { promocodeAdminSceneId } from '@scenes/admin/promocodeScene';
import { promocodeService } from '@services/promocode';
import { messageSceneId } from 'src/scenes/customer/messageScene';
import { Scenes } from 'telegraf';

import {
	promocodesAdminSceneConfigkeyboard,
	promocodesSceneConfigAdmin as config,
	promocodesSceneConfigAdmin,
} from './promocodesSceneConfig-admin';

import { backButton } from '@/constsants/buttons';
import { getMenuKeyboard } from '@/utils/getMenuKeyboard';

export const promocodesAdminSceneId = config.sceneId;

export const promocodesSceneAdmin = new Scenes.BaseScene<MyContext>(promocodesAdminSceneId);

promocodesSceneAdmin.enter(async (ctx) => {
	const promocodes = await promocodeService.getAllPromocodes();

	await ctx.editMessageText(promocodesSceneConfigAdmin.text, {
		reply_markup: getMenuKeyboard(
			promocodesAdminSceneConfigkeyboard(Object.values(promocodes).reverse(), 0, 5).keyboard()
		).reply_markup,
	});
});

promocodesSceneAdmin.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(heroSceneAdminId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'next' || parsed.split('_')[0] === 'prev') {
			const countPrev = Number(parsed.split('_')[1]);
			const countNext = Number(parsed.split('_')[2]);

			const promocodes = await promocodeService.getAllPromocodes();

			await ctx.editMessageText(promocodesSceneConfigAdmin.text, {
				reply_markup: getMenuKeyboard(
					promocodesAdminSceneConfigkeyboard(Object.values(promocodes), countPrev, countNext).keyboard()
				).reply_markup,
			});
		} else if (parsed.split('_')[0] === 'promocodeId') {
			await ctx.scene.enter(promocodeAdminSceneId, { promocodeId: Number(parsed.split('_')[1]) });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

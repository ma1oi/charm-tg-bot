import { backButton } from '@constsants/buttons';
import { heroSceneAdminId } from '@scenes/admin/heroScene';
import { getMyOrdersSceneArtistId } from '@scenes/artist/getMyOrdersScene';
import { promocodeService } from '@services/promocode';
import { messageSceneId } from 'src/scenes/customer/messageScene';
import { Scenes } from 'telegraf';

import { promocodeSceneConfig } from './promocodeSceneConfig';

export const promocodeAdminSceneId = promocodeSceneConfig.sceneId;
export const promocodeAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(promocodeAdminSceneId);

promocodeAdminScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	const { promocodeId } = ctx.scene.state as { promocodeId: number };

	const promocode = await promocodeService.getPromocodeById(promocodeId);

	const promocodesTypes = {
		'fixed': 'фиксированный',
		'percent': 'процентная',
	}

	const message = `Промокод #id_${promocode.id}\nНазвание: ${promocode.code}\nТип: ${promocodesTypes[promocode.discountType]}\nСкидка: ${promocode.discountValue}\nИспользований: ${promocode.usedCount}/${promocode.maxUses}\nЗакончен: ${promocode.expiresAt ?? 'не закончен'}`;

	await ctx.editMessageText(message);
	await ctx.scene.enter(heroSceneAdminId);
});

promocodeAdminScene.on('callback_query', async (ctx) => {
	const callback = ctx.callbackQuery;

	if ('data' in callback) {
		const key = callback.data;
		const parsed = JSON.parse(key);

		if (parsed === backButton.key) {
			await ctx.scene.enter(getMyOrdersSceneArtistId, { from: backButton.key });
		} else if (parsed.split('_')[0] === 'replyMessage') {
			await ctx.scene.enter(messageSceneId, { key: parsed, fromScene: ctx.scene.current?.id });
		}
	}

	await ctx.answerCbQuery();
});

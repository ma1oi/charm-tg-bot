import { backButton } from '@constsants/buttons';
import { OrderStatus } from '@prisma/client';
import { artistAdminSceneId } from '@scenes/admin/artistScene';
import { artistsAdminSceneId } from '@scenes/admin/artistsScene';
import { orderService } from '@services/order';
import { getMenuKeyboard } from '@utils/getMenuKeyboard';
import { Scenes } from 'telegraf';

import { closeOrderSceneConfigAdmin } from './closeOrderSceneConfig-admin';

export const closeOrderAdminSceneId = closeOrderSceneConfigAdmin.sceneId;
export const closeOrderAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(closeOrderAdminSceneId);

closeOrderAdminScene.enter(async (ctx) => {
	if (!ctx.from) {
		throw new Error('ctx.from not implemented');
	}

	await ctx.editMessageText(closeOrderSceneConfigAdmin.text, {
		reply_markup: getMenuKeyboard(closeOrderSceneConfigAdmin.keyboard).reply_markup,
	});
});

closeOrderAdminScene.on('text', async (ctx) => {
	const orderId = Number(ctx.text);

	const editedOrder = await orderService.updateOrder({
		id: orderId,
		status: OrderStatus.done,
		completedAt: new Date(),
	});

	await ctx.reply(`Статус ордера id_${orderId} был изменен на "выполнен"`);
	await ctx.scene.enter(artistsAdminSceneId, { from: backButton.key });
});

closeOrderAdminScene.on('callback_query', async (ctx) => {
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

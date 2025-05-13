import { CreatePromocodeState, MyContextWizard } from '@myContext/myContext';
import { DiscountType } from '@prisma/client';
import { createPromocodeSceneConfigAdmin } from '@scenes/admin/createPromocodeScene/createPromocodeSceneConfig-admin';
import { heroSceneAdminId } from '@scenes/admin/heroScene';
import { promocodeService } from '@services/promocode';
import { Scenes } from 'telegraf';

export const createPromocodeSceneAdminId = createPromocodeSceneConfigAdmin.sceneId;

export const createPromocodeSceneAdmin = new Scenes.WizardScene<MyContextWizard>(
	createPromocodeSceneAdminId,
	async (ctx) => {
		ctx.wizard.state = {};
		await ctx.reply('Введите название промокода:');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Пожалуйста, введите название промокода текстом.');
			return;
		}

		const promocode = await promocodeService.getPromocodeByCode(ctx.message.text);

		if (Object.keys(promocode).length === 0) {
			(ctx.wizard.state as CreatePromocodeState).code = ctx.message.text;
			await ctx.reply('Выберите тип скидки:', {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: 'Фиксированная', callback_data: DiscountType.fixed },
							{ text: 'Процентная', callback_data: DiscountType.percent },
						],
					],
				},
			});
			return ctx.wizard.next();
		} else {
			await ctx.reply('промо существует введи другое название');
			return;
		}
	},
	async (ctx) => {
		if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
			await ctx.reply('Пожалуйста, выберите тип скидки кнопкой.', {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: 'Фиксированная', callback_data: DiscountType.fixed },
							{ text: 'Процентная', callback_data: DiscountType.percent },
						],
					],
				},
			});
			return;
		}
		(ctx.wizard.state as CreatePromocodeState).discountType = ctx.callbackQuery.data as 'fixed' | 'percent';
		await ctx.answerCbQuery();
		await ctx.editMessageText('Введите значение скидки (число):');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message) || isNaN(Number(ctx.message.text))) {
			await ctx.reply('Пожалуйста, введите корректное число для значения скидки.');
			return;
		}
		const discountValue = Number(ctx.message.text);
		const state = ctx.wizard.state as CreatePromocodeState;
		if (state.discountType === DiscountType.percent && (discountValue <= 0 || discountValue > 100)) {
			await ctx.reply('Процентная скидка должна быть между 1 и 100.');
			return;
		}
		if (state.discountType === DiscountType.fixed && discountValue <= 0) {
			await ctx.reply('Фиксированная скидка должна быть больше 0.');
			return;
		}

		state.discountValue = discountValue;
		await ctx.reply('Сколько раз можно активировать промокод всего?');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message) || isNaN(Number(ctx.message.text)) || Number(ctx.message.text) < 0) {
			await ctx.reply('Пожалуйста, введите корректное число (больше 0) для максимального количества активаций.');
			return;
		}
		const maxUses = Number(ctx.message.text);
		(ctx.wizard.state as CreatePromocodeState).maxUses = maxUses === 0 ? null : maxUses;

		const state = ctx.wizard.state as CreatePromocodeState;

		if (!state.code || !state.discountType || state.discountValue === undefined || state.maxUses === null) {
			await ctx.reply('Произошла ошибка сбора данных. Попробуйте снова.');
			console.error('Incomplete promocode state:', state);
			return ctx.scene.reenter();
		}

		try {
			const promocode = await promocodeService.createPromocode({
				code: state.code,
				discountValue: state.discountValue,
				discountType: state.discountType,
				maxUses: state.maxUses,
			});

			await ctx.reply(`создан промокод \`${promocode.code}\``, { parse_mode: 'MarkdownV2' });
		} catch (error) {
			console.error('Failed to create promocode:', error);
			await ctx.reply('Не удалось создать промокод. Проверьте консоль сервера для деталей.');
			if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
				await ctx.reply('Промокод с таким названием уже существует. Попробуйте другое название.');
			}
		}

		await ctx.scene.enter(heroSceneAdminId);
		return ctx.scene.leave();
	}
);

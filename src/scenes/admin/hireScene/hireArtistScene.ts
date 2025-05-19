import { CreatePromocodeState, HireArtistState, MyContextWizard } from '@myContext/myContext';
import { DiscountType, Role } from '@prisma/client';
import { artistsAdminSceneId } from '@scenes/admin/artistsScene';
import { heroSceneAdminId } from '@scenes/admin/heroScene';
import { artistService } from '@services/artist';
import { promocodeService } from '@services/promocode';
import { userService } from '@services/user';
import { Scenes } from 'telegraf';

import { hireArtistSceneConfig } from './hireArtistSceneConfig';
import { backButton } from '@constsants/buttons';
import { prisma } from '@config/database';

export const hireArtistAdminSceneId = hireArtistSceneConfig.sceneId;
export const hireArtistAdminScene = new Scenes.WizardScene<MyContextWizard>(
	hireArtistAdminSceneId,
	async (ctx) => {
		ctx.wizard.state = {};
		await ctx.reply('Введите Телеграм ID художника');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message) || !ctx.text) {
			await ctx.reply('Введите Телеграм ID художника');
			return;
		}

		try {
			BigInt(ctx.text)
		} catch (e) {
			await ctx.reply('Введите Телеграм ID художника');
			return;
		}

		const artist = (await userService.getUserByTuid(BigInt(ctx.text))) ?? {};

		if (Object.keys(artist).length !== 0 && artist.role === Role.artist) {
			await ctx.reply('Этот человек уже художник');
			await ctx.scene.enter(artistsAdminSceneId, { from: backButton.key });
		} else {
			const state = ctx.wizard.state as HireArtistState;

			state.tuid = Number(ctx.text);

			await ctx.reply('Введите отображаемое имя художника без нижнего подчеркивания');
			return ctx.wizard.next();
		}
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Введите отображаемое имя художника без нижнего подчеркивания');
			return;
		}

		const state = ctx.wizard.state as HireArtistState;

		state.name = ctx.text.toString();
		await ctx.reply('Введите категорию');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Пожалуйста, введите корректную категорию');
			return;
		}

		const state = ctx.wizard.state as HireArtistState;

		const category = await artistService.getCategoryByName(ctx.text.toString())

		if (category === null) {
			await ctx.reply('Категория не найдена. Введите другую');
			return;
		}

		state.category = ctx.text.toString();

		await ctx.reply('Введите ссылку на картинку');
		return ctx.wizard.next();

	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Пожалуйста, введите корректную ссылку');
			return;
		}

		const state = ctx.wizard.state as HireArtistState;

		state.imgUrl = ctx.text.toString();

		const artist = await userService.getUserByTuid(BigInt(state.tuid));

		await prisma.user.update({
			where: { tuid: artist.tuid },
			data: { role: Role.artist },
		});

		const createdArtist = await artistService.createArtist({
			name: state.name,
			userId: artist.id,
		});

		const addedArtistToCategory = await artistService.addArtistToCategory({
			name: state.name,
			category: state.category,
			userId: artist.id,
			imgUrl: state.imgUrl,
		});

		await ctx.reply(`Художник ${artist.username === '' ? '' : '@' + artist.username + ','} id_${artist.id} был добавлен в художники`);

		await ctx.scene.enter(artistsAdminSceneId, { from: backButton.key });
		return ctx.scene.leave();
	}
);

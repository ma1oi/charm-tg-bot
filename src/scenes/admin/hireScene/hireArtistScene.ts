import { CreatePromocodeState, HireArtistState, MyContextWizard } from '@myContext/myContext';
import { DiscountType } from '@prisma/client';
import { artistsAdminSceneId } from '@scenes/admin/artistsScene';
import { heroSceneAdminId } from '@scenes/admin/heroScene';
import { artistService } from '@services/artist';
import { promocodeService } from '@services/promocode';
import { userService } from '@services/user';
import { Scenes } from 'telegraf';

import { hireArtistSceneConfig } from './hireArtistSceneConfig';

export const hireArtistAdminSceneId = hireArtistSceneConfig.sceneId;
export const hireArtistAdminScene = new Scenes.WizardScene<MyContextWizard>(
	hireArtistAdminSceneId,
	async (ctx) => {
		ctx.wizard.state = {};
		await ctx.reply('введите тг айди художника');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Пожалуйста, тг айди текстом');
			return; // Остаемся на этом же шаге
		}

		const artist = (await artistService.getArtistByUserId(Number(ctx.text))) ?? {};

		if (Object.keys(artist).length !== 0) {
			await ctx.reply('чел уже художник');
			await ctx.scene.enter(artistsAdminSceneId);
		} else {
			const state = ctx.wizard.state as HireArtistState;

			state.tuid = BigInt(ctx.text);

			await ctx.reply('введите отображаемое имя художника без _!!!');
			return ctx.wizard.next();
		}
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('введите нормальное отображаемое имя художника без _!!!');
			return;
		}

		const state = ctx.wizard.state as HireArtistState;

		state.name = ctx.text.toString();
		await ctx.reply('категория');
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Пожалуйста, введите корректную категорию');
			return;
		}

		const state = ctx.wizard.state as HireArtistState;

		state.category = ctx.text.toString();

		await ctx.reply('юрл картинки');
		return ctx.wizard.next();

		// await ctx.scene.enter(heroSceneAdminId);
		// return ctx.scene.leave();
	},
	async (ctx) => {
		if (!ctx.message || !('text' in ctx.message)) {
			await ctx.reply('Пожалуйста, введите корректную ссылку');
			return;
		}

		const state = ctx.wizard.state as HireArtistState;

		state.imgUrl = ctx.text.toString();

		const artist = await userService.getUserByTuid(state.tuid);

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

		await ctx.reply('добавлен');

		// await ctx.scene.enter(heroSceneAdminId);
		return ctx.scene.leave();
	}
);

// export const hireArtistAdminScene = new Scenes.BaseScene<Scenes.SceneContext>(hireArtistAdminSceneId);
//
// hireArtistAdminScene.enter(async (ctx) => {
// 	if (!ctx.from) {
// 		throw new Error('ctx.from not implemented');
// 	}
//
// 	await ctx.editMessageText(hireArtistSceneConfig.text, {
// 		reply_markup: getMenuKeyboard(hireArtistSceneConfig.keyboard).reply_markup,
// 	});
// });
//
// hireArtistAdminScene.on('text', async (ctx) => {
// 	const hidedActor = await artistService.dismissAndHireArtist(BigInt(ctx.text), 'hire');
//
// 	await ctx.sendMessage(`Художник @${hidedActor.username}, id_${hidedActor.id} был нанят`);
// 	await ctx.scene.enter(artistsAdminSceneId, { from: backButton.key });
// });
//
// hireArtistAdminScene.on('callback_query', async (ctx) => {
// 	const callback = ctx.callbackQuery;
//
// 	if ('data' in callback) {
// 		const key = callback.data;
//
// 		console.log(key);
//
// 		const parsed = JSON.parse(key);
//
// 		console.log(55554, parsed);
//
// 		if (parsed === backButton.key) {
// 			await ctx.scene.enter(artistsAdminSceneId);
// 		}
// 	}
//
// 	await ctx.answerCbQuery();
// });

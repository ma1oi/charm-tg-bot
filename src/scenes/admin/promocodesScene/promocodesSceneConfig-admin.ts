import { Promocode } from '@prisma/client';

import { backButton } from '@/constsants/buttons';
import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

const promocodesKeyboard = (promocodes: Promocode[], countPrev: number, countNext: number) => {
	let promocodesKeyboardArray: KeyboardButton[] = [];

	for (const promocode of promocodes.slice(countPrev, countNext)) {
		const row = [
			{
				type: BUTTON_TYPES.CALLBACK,
				key: 'promocodeId_' + promocode.id,
				label: promocode.code,
			},
		];

		promocodesKeyboardArray = [...promocodesKeyboardArray, { type: BUTTON_TYPES.SEPARATOR }, ...row];
	}

	const pageSize = countNext - countPrev;
	const newCountPrev = countPrev - pageSize;
	const newCountNext = countNext - pageSize;

	if (promocodes.length > countNext) {
		if (countPrev === 0) {
			promocodesKeyboardArray = [
				...promocodesKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{ type: BUTTON_TYPES.CALLBACK, key: `next_${countPrev + countNext}_${countNext + countNext}`, label: 'дальше' },
			];
		} else {
			promocodesKeyboardArray = [
				...promocodesKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `prev_${newCountPrev}_${newCountNext}`,
					label: 'предыдущее',
				},
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `next_${countNext}_${countNext + pageSize}`,
					label: 'дальше',
				},
			];
		}
	} else if (promocodes.length < countNext) {
		promocodesKeyboardArray = [
			...promocodesKeyboardArray,
			{ type: BUTTON_TYPES.SEPARATOR },
			{
				type: BUTTON_TYPES.CALLBACK,
				key: `prev_${newCountPrev}_${newCountNext}`,
				label: 'предыдущее',
			},
		];
	}

	promocodesKeyboardArray = [
		...promocodesKeyboardArray,
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	];

	return promocodesKeyboardArray;
};

export const promocodesSceneConfigAdmin: ScenesConfig = {
	sceneId: 'getPromocodesSceneAdmin',
	text: 'промокоды',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [],
};

export const promocodesAdminSceneConfigkeyboard = (promocodes: Promocode[], countPrev = 0, countNext: number) => {
	return {
		keyboard: () => promocodesKeyboard(promocodes, countPrev, countNext),
	};
};

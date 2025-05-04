import { User } from '@prisma/client';

import { backButton } from '@/constsants/buttons';
import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

const artistsKeyboard = (artists: User[], countPrev: number, countNext: number) => {
	let artistsKeyboardArray: KeyboardButton[] = [];

	for (const artist of artists.slice(countPrev, countNext)) {
		const row = [
			{
				type: BUTTON_TYPES.CALLBACK,
				key: 'artistId_' + artist.id,
				label: 'id_' + artist.id + ' @' + artist.username,
			},
		];

		artistsKeyboardArray = [...artistsKeyboardArray, { type: BUTTON_TYPES.SEPARATOR }, ...row];
	}

	const pageSize = countNext - countPrev;
	const newCountPrev = countPrev - pageSize;
	const newCountNext = countNext - pageSize;

	if (artists.length > countNext) {
		if (countPrev === 0) {
			artistsKeyboardArray = [
				...artistsKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{ type: BUTTON_TYPES.CALLBACK, key: `next_${countPrev + countNext}_${countNext + countNext}`, label: 'дальше' },
			];
		} else {
			artistsKeyboardArray = [
				...artistsKeyboardArray,
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
	} else if (artists.length === countNext) {
		artistsKeyboardArray = [
			...artistsKeyboardArray,
			{ type: BUTTON_TYPES.SEPARATOR },
			{
				type: BUTTON_TYPES.CALLBACK,
				key: `prev_${newCountPrev}_${newCountNext}`,
				label: 'предыдущее',
			},
		];
	}

	artistsKeyboardArray = [
		...artistsKeyboardArray,
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	];

	return artistsKeyboardArray;
};

export const allArtistsSceneConfigAdmin: ScenesConfig = {
	sceneId: 'getPromocodesSceneAdmin',
	text: 'художники список',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [],
};

export const allArtistsAdminSceneConfigkeyboard = (artists: User[], countPrev = 0, countNext: number) => {
	return {
		keyboard: () => artistsKeyboard(artists, countPrev, countNext),
	};
};

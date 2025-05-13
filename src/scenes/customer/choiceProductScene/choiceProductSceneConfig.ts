import { backButton } from '@constsants/buttons';
import { products } from '@scenes/customer/choiceProductScene/index';

import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

const productKeyboard = () => {
	let productKeyboardArray: KeyboardButton[] = [];

	for (const product of products) {
		const row = product.map((item) => ({
			type: BUTTON_TYPES.CALLBACK,
			key: item.name + '_' + item.id,
			label: item.name + ' - ' + item.cost + '₽',
		}));

		productKeyboardArray = [...productKeyboardArray, { type: BUTTON_TYPES.SEPARATOR }, ...row];
	}

	productKeyboardArray = [
		...productKeyboardArray,
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	];

	return productKeyboardArray;
};

export const choiceProductSceneConfig: ScenesConfig = {
	sceneId: 'choiceProduct',
	text: 'choiceProduct',
	image: 'https://i.postimg.cc/WbCYGSsV/start-Customer-Scene.png',
	keyboard: () => productKeyboard(),
};

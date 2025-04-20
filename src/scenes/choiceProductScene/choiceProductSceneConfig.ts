import { backButton } from '@/constsants/buttons';
import { products } from '@/scenes/choiceProductScene';
import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

const productKeyboard = () => {
	let productKeyboardArray: KeyboardButton[] = [];

	for (const product of products) {
		const row = product.map((item) => ({
			type: BUTTON_TYPES.CALLBACK,
			key: item.name, // todo
			label: item.name,
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
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: productKeyboard(),
};

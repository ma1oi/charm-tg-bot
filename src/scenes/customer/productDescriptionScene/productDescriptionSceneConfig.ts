import { backButton } from '@constsants/buttons';

import { BUTTON_TYPES } from '@/types/keyboard';

export const productDescriptionSceneConfig = {
	sceneId: 'productDescription',
	text: 'Here is the product description.',
	keyboard: [
		{ type: BUTTON_TYPES.CALLBACK, key: 'order', label: 'Заказать' },
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	],
};

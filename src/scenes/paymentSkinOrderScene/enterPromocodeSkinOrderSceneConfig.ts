import { backButton } from '@constsants/buttons';

import { BUTTON_TYPES } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

export const enterPromocodeSkinOrderSceneConfig: ScenesConfig = {
	sceneId: 'paymentSkinOrder',
	text: 'плати',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [
		{ type: BUTTON_TYPES.CALLBACK, key: 'paid', label: 'оплатил' },
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	],
};

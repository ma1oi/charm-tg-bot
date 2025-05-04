import { backButton, promocodeButton } from '@constsants/buttons';

import { BUTTON_TYPES } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

export const enterPromocodeSkinOrderSceneConfig: ScenesConfig = {
	sceneId: 'enterPromocedeSkinOrder',
	text: 'промокод',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [
		{ type: BUTTON_TYPES.CALLBACK, key: promocodeButton.key, label: promocodeButton.label },
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	],
};

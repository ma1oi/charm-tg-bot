import { backButton } from '@constsants/buttons';

import { BUTTON_TYPES } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

export const paymentSkinOrderSceneConfig: ScenesConfig = {
	sceneId: 'paymentSkinOrder',
	text: 'Оплатите счёт по кнопке ниже и нажмите "Проверить платёж"',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [{ type: BUTTON_TYPES.CALLBACK, key: 'cancel', label: 'Отменить' }],
};

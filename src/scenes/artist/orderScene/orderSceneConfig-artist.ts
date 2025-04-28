import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const orderSceneConfigArtist: ScenesConfig = {
	sceneId: 'orderSceneArtist',
	text: 'ордер',
	keyboard: [
		{ type: 'callback', key: 'submitSkin', label: 'Сдать скин' },
		{ type: 'callback', key: 'messageCustomer', label: 'Написать заказчику' },
		{ type: 'callback', key: backButton.key, label: backButton.label },
	],
};

import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const orderSceneConfigArtist: ScenesConfig = {
	sceneId: 'orderSceneArtist',
	text: 'ордер',
	keyboard: [
		{ type: 'callback', key: 'submitSkin', label: 'Сдать скин' },
		{ type: 'separator' },
		{ type: 'callback', key: 'messageCustomer', label: 'Написать заказчику' },
		{ type: 'separator' },
		{ type: 'callback', key: backButton.key, label: backButton.label },
	],
};

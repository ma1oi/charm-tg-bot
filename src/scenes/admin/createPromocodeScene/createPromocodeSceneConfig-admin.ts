import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const createPromocodeSceneConfigAdmin: ScenesConfig = {
	sceneId: 'createPromocodeAdminScene',
	text: 'промо',
	keyboard: [
		// { type: 'callback', key: 'createPromocode', label: 'Создать промокод' },
		// { type: 'separator' },
		// { type: 'callback', key: 'getMyOrders', label: 'мои заказы' },
		{ type: 'callback', key: backButton.key, label: backButton.label },
	],
};

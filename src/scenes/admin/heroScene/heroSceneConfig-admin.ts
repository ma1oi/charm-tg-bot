import { promocodesAdminSceneId } from '@scenes/admin/promocodesScene';

import { ScenesConfig } from '@/types/sceneConfig';

export const heroSceneConfigAdmin: ScenesConfig = {
	sceneId: 'heroAdminScene',
	text: 'хиро админ',
	keyboard: [
		{ type: 'callback', key: 'createPromocode', label: 'Создать промокод' },
		{ type: 'separator' },
		{ type: 'callback', key: promocodesAdminSceneId, label: 'Промокоды' },
		{ type: 'separator' },
		{ type: 'callback', key: 'getMyOrders', label: 'мои заказы' },
	],
};

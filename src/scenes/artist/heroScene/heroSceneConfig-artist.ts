import { ScenesConfig } from '@/types/sceneConfig';

export const heroSceneConfigArtist: ScenesConfig = {
	sceneId: 'heroArtist',
	text: 'Меню художника:',
	keyboard: [
		{ type: 'callback', key: 'getNewOrder', label: 'Получить новый заказ' },
		{ type: 'separator' },
		{ type: 'callback', key: 'getMyOrders', label: 'Мои заказы' },
	],
};

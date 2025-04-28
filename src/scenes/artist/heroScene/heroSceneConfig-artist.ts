import { ScenesConfig } from '@/types/sceneConfig';

export const heroSceneConfigArtist: ScenesConfig = {
	sceneId: 'heroArtist',
	text: 'хиро',
	keyboard: [
		{ type: 'callback', key: 'getNewOrder', label: 'получить новый заказ' },
		{ type: 'separator' },
		{ type: 'callback', key: 'getMyOrders', label: 'мои заказы' },
	],
};

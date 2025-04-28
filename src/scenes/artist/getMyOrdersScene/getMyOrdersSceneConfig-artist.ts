import { ScenesConfig } from '@/types/sceneConfig';

export const getMyOrdersSceneConfigArtist: ScenesConfig = {
	sceneId: 'getMyOrders',
	text: 'ордер',
	keyboard: [{ type: 'callback', key: 'getOrder', label: 'заглушка' }],
};

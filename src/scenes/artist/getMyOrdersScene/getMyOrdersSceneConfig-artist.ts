import { ScenesConfig } from '@/types/sceneConfig';

export const getMyOrdersSceneConfigArtist: ScenesConfig = {
	sceneId: 'getMyOrders',
	text: '',
	keyboard: [{ type: 'callback', key: 'getOrder', label: 'заглушка' }],
};

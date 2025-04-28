import { ScenesConfig } from '@/types/sceneConfig';

export const getOrderSceneConfigArtist: ScenesConfig = {
	sceneId: 'getNewOrder',
	text: 'ордер',
	keyboard: [{ type: 'callback', key: 'getOrder', label: 'заглушка' }],
};

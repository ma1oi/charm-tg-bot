import { ScenesConfig } from '@/types/sceneConfig';

export const getOrderSceneConfigArtist: ScenesConfig = {
	sceneId: 'getNewOrder',
	text: '',
	keyboard: [{ type: 'callback', key: 'getOrder', label: 'заглушка' }],
};

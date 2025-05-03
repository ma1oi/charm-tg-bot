import { ScenesConfig } from '@/types/sceneConfig';

export const promocodeSceneConfig: Omit<ScenesConfig, 'keyboard'> = {
	sceneId: 'promocodeSceneId',
	text: 'ордер',
	// keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

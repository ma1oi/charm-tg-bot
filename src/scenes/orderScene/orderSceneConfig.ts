import { ScenesConfig } from '@/types/sceneConfig';

export const orderSceneConfig: Omit<ScenesConfig, 'keyboard'> = {
	sceneId: 'orderScene',
	text: 'ордер',
	// keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

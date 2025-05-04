import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const artistSceneConfig: ScenesConfig = {
	sceneId: 'artistScene',
	text: 'ордер',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

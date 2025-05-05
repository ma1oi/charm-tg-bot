import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const closeOrderSceneConfigAdmin: ScenesConfig = {
	sceneId: 'closeOrderScene',
	text: 'напиши айди ордера который надо закрыть',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

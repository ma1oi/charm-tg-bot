import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const closeOrderSceneConfigAdmin: ScenesConfig = {
	sceneId: 'closeOrderScene',
	text: 'Напишите id ордера, который надо зыкрыть',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

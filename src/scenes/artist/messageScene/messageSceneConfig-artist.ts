import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const messageSceneConfigArtist: ScenesConfig = {
	sceneId: 'messageCustomer',
	text: 'Напиши сообщение',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

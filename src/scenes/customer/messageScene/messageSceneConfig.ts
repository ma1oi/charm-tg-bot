import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const messageSceneConfig: ScenesConfig = {
	sceneId: 'messageArtist',
	text: 'Напишите сообщение художнику',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

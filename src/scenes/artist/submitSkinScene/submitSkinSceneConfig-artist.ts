import { supportButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const submitSkinSceneConfigArtist: ScenesConfig = {
	sceneId: 'submitSkin',
	text: 'напиши сообщение',
	keyboard: [{ type: 'separator' }, { type: 'url', url: supportButton.url, label: supportButton.label }],
};

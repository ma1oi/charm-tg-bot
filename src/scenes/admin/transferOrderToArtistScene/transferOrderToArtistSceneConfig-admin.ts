import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const transferOrderToArtistSceneConfigAdmin: ScenesConfig = {
	sceneId: 'transferOrderToArtistSceneId',
	text: 'напиши айди заказа и тг айди художника кому передать',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

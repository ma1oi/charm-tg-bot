import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const createPromocodeSceneConfigAdmin: ScenesConfig = {
	sceneId: 'createPromocodeAdminScene',
	text: 'промо',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

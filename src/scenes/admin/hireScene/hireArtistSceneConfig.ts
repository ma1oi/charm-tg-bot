import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const hireArtistSceneConfig: ScenesConfig = {
	sceneId: 'hireArtistScene',
	text: 'Введите айди чела',
	keyboard: [
		{ type: 'url', url: 'https://t.me/getmyid_bot', label: 'Поулчить тгайди' },
		{ type: 'separator' },
		{ type: 'callback', key: backButton.key, label: backButton.label },
	],
};

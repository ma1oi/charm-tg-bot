import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const artistsSceneConfigAdmin: ScenesConfig = {
	sceneId: 'artistsSceneId',
	text: 'Действия с художниками:',
	keyboard: [
		{ type: 'callback', key: 'allArtists', label: 'Список художников' },
		{ type: 'separator' },
		{ type: 'callback', key: 'hireArtists', label: 'Нанять художника' },
		{ type: 'separator' },
		{ type: 'callback', key: 'closeOrder', label: 'Закрыть заказ' },
		{ type: 'separator' },
		{ type: 'callback', key: 'transferOrderToArtist', label: 'Передать заказ другому художнику' },
		{ type: 'separator' },
		{ type: 'callback', key: backButton.key, label: backButton.label },
	],
};

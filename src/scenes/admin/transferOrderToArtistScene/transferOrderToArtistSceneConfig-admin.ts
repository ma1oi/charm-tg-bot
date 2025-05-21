import { backButton } from '@constsants/buttons';

import { ScenesConfig } from '@/types/sceneConfig';

export const transferOrderToArtistSceneConfigAdmin: ScenesConfig = {
	sceneId: 'transferOrderToArtistSceneId',
	text: 'Напишите id заказа и Телеграм id художника, которому нужно передать заказ',
	keyboard: [{ type: 'callback', key: backButton.key, label: backButton.label }],
};

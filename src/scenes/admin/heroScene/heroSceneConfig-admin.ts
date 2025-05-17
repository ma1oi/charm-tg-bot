import { ScenesConfig } from '@/types/sceneConfig';

export const heroSceneConfigAdmin: ScenesConfig = {
	sceneId: 'heroAdminScene',
	text: '',
	keyboard: [
		{ type: 'callback', key: 'createPromocode', label: 'Создать промокод' },
		{ type: 'separator' },
		{ type: 'callback', key: 'getPromocodes', label: 'Промокоды' },
		{ type: 'separator' },
		{ type: 'callback', key: 'artists', label: 'Художники' },
	],
};

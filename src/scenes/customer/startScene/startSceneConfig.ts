import { ScenesConfig } from '@types/sceneConfig';

export const startSceneConfig: ScenesConfig = {
	sceneId: 'start',
	text: 'старт',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [
		{ type: 'callback', key: 'choiceProduct', label: 'Button 1' },
		{ type: 'separator' },
		{ type: 'url', url: 'https://t.me/charm_support', label: 'Поддержка' },
		{ type: 'separator' },
		{ type: 'callback', key: 'myOrders', label: 'Мои заказы' },
	],
};

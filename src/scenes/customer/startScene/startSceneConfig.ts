import { ScenesConfig } from '@/types/sceneConfig';

export const startSceneConfig: ScenesConfig = {
	sceneId: 'start',
	text:
		'Добро пожаловать!\nМы Charm Skins — студия по созданию скинов Minecraft.\n' +
		'Здесь вы можете заказать любой из представленых ниже товаров.',
	image: 'https://i.postimg.cc/WbCYGSsV/start-Customer-Scene.png',
	keyboard: [
		{ type: 'callback', key: 'choiceProduct', label: 'Выберите товар' },
		{ type: 'separator' },
		{ type: 'callback', key: 'myOrders', label: 'Мои заказы' },
		{ type: 'separator' },
		{ type: 'url', url: 'https://t.me/charm_support', label: 'Поддержка' },
	],
};

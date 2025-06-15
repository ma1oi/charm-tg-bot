import { backButton } from '@constsants/buttons';
import { Order } from '@prisma/client';

import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

const ordersKeyboard = (orders: Order[], countPrev: number, countNext: number) => {
	let ordersKeyboardArray: KeyboardButton[] = [];

	for (const order of orders.slice(countPrev, countNext)) {
		const row = [
			{
				type: BUTTON_TYPES.CALLBACK,
				key: 'orderId_' + order.id,
				label: 'Заказ ' + order.id,
			},
		];

		ordersKeyboardArray = [...ordersKeyboardArray, { type: BUTTON_TYPES.SEPARATOR }, ...row];
	}

	const pageSize = countNext - countPrev;
	const newCountPrev = countPrev - pageSize;
	const newCountNext = countNext - pageSize;

	if (orders.length > countNext) {
		if (countPrev === 0) {
			ordersKeyboardArray = [
				...ordersKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `next_${countPrev + countNext}_${countNext + countNext}`,
					label: 'Следующие',
				},
			];
		} else {
			ordersKeyboardArray = [
				...ordersKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `prev_${newCountPrev}_${newCountNext}`,
					label: 'Предыдущие',
				},
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `next_${countNext}_${countNext + pageSize}`,
					label: 'Следующие',
				},
			];
		}
	} else if (orders.length < countNext) {
		ordersKeyboardArray = [
			...ordersKeyboardArray,
			{ type: BUTTON_TYPES.SEPARATOR },
			{
				type: BUTTON_TYPES.CALLBACK,
				key: `prev_${newCountPrev}_${newCountNext}`,
				label: 'Предыдущие',
			},
		];
	}

	ordersKeyboardArray = [
		...ordersKeyboardArray,
		{ type: BUTTON_TYPES.SEPARATOR },
		{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label },
	];

	return ordersKeyboardArray;
};

export const myOrdersSceneConfig: ScenesConfig = {
	sceneId: 'myOrders',
	text: 'Все твои заказы:',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [],
};

export const myOrdersSceneConfigkeyboard = (orders: Order[], countPrev = 0, countNext: number) => {
	return {
		keyboard: () => ordersKeyboard(orders, countPrev, countNext),
	};
};

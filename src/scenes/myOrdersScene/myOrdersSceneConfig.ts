import { Order } from '@prisma/client';

import { backButton } from '@/constsants/buttons';
import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

const ordersKeyboard = (orders: Order[], countPrev: number, countNext: number) => {
	let ordersKeyboardArray: KeyboardButton[] = [];

	if (orders.length > countNext) {
		for (const order of orders.slice(countPrev, countNext)) {
			const row = [
				{
					type: BUTTON_TYPES.CALLBACK,
					key: 'orderId_' + order.id,
					label: 'id_' + order.id,
				},
			];

			ordersKeyboardArray = [...ordersKeyboardArray, { type: BUTTON_TYPES.SEPARATOR }, ...row];
		}

		if (countPrev === 0) {
			ordersKeyboardArray = [
				...ordersKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{ type: BUTTON_TYPES.CALLBACK, key: `next_${countPrev + countNext}_${countNext + countNext}`, label: 'дальше' },
			];
		} else {
			const pageSize = countNext - countPrev;
			const newCountPrev = countPrev - pageSize;
			const newCountNext = countNext - pageSize;

			ordersKeyboardArray = [
				...ordersKeyboardArray,
				{ type: BUTTON_TYPES.SEPARATOR },
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `prev_${newCountPrev}_${newCountNext}`,
					label: 'предыдущее',
				},
				{
					type: BUTTON_TYPES.CALLBACK,
					key: `next_${countNext}_${countNext + pageSize}`,
					label: 'дальше',
				},
			];
		}
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
	text: 'твои ордера',
	image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
	keyboard: [],
};

export const myOrdersSceneConfigkeyboard = (orders: Order[], countPrev = 0, countNext: number) => {
	return {
		keyboard: () => ordersKeyboard(orders, countPrev, countNext),
	};
};

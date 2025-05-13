import { Markup } from 'telegraf';

import { BUTTON_TYPES, KeyboardButton } from '@/types/keyboard';

export const getMenuKeyboard = (keyboard: KeyboardButton[] | (() => KeyboardButton[])) => {
	const actualKeyboard = typeof keyboard === 'function' ? keyboard() : keyboard;

	const rows: ReturnType<typeof Markup.button.callback | typeof Markup.button.url>[][] = [];
	let currentRow: (typeof rows)[number] = [];

	for (const item of actualKeyboard) {
		if (item.type === BUTTON_TYPES.SEPARATOR) {
			if (currentRow.length) {
				rows.push(currentRow);
				currentRow = [];
			}
		} else if (item.type === BUTTON_TYPES.CALLBACK) {
			currentRow.push(Markup.button.callback(item.label, JSON.stringify(item.key)));
		} else if (item.type === BUTTON_TYPES.URL) {
			currentRow.push(Markup.button.url(item.label, item.url));
		}
	}

	if (currentRow.length) {
		rows.push(currentRow);
	}

	return Markup.inlineKeyboard(rows);
};

export const BUTTON_TYPES = {
	CALLBACK: 'callback',
	URL: 'url',
	SEPARATOR: 'separator',
} as const;

export type CallbackButton = {
	type: typeof BUTTON_TYPES.CALLBACK;
	key: string;
	label: string;
};

export type UrlButton = {
	type: typeof BUTTON_TYPES.URL;
	url: string;
	label: string;
};

export type Separator = {
	type: typeof BUTTON_TYPES.SEPARATOR;
};

export type KeyboardButton = CallbackButton | UrlButton | Separator;

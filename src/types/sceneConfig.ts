import { KeyboardButton } from './keyboard';

export type ScenesConfig = {
	sceneId: string;
	text: string;
	image?: string;
	keyboard: KeyboardButton[];
};

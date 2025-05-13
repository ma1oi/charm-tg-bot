import { backButton } from '@constsants/buttons';

import { BUTTON_TYPES } from '@/types/keyboard';
import { ScenesConfig } from '@/types/sceneConfig';

export const descriptionSkinOrderSceneConfig: ScenesConfig = {
	sceneId: 'descriptionSkinOrder',
	text:
		'Опишите как должен выглядить ваш скин и по желанию приложите несколько файлов для художника.\n' +
		'Учтите, что нужно приложить фотографии в виде файла. Ниже показано как это сделать.',
	image: 'https://i.postimg.cc/d390rn7j/description-Order.png',
	keyboard: [{ type: BUTTON_TYPES.CALLBACK, key: backButton.key, label: backButton.label }],
};

import { Context as TelegrafContext, Scenes } from 'telegraf';

type OrderData = {
	product?: string;
	descriptionProduct?: string;
	promocode?: string;
	promocodeName?: string;
	orderId?: number;
};

export type CreatePromocodeState = {
	code?: string;
	discountType?: 'fixed' | 'percent';
	discountValue?: number;
	maxUses?: number | null;
	usageLimit?: number;
};

export type MySession = {
	orderData?: OrderData;
} & Scenes.SceneSession;

export type MyBaseContext = {
	session: MySession;
	user?: { id: number };
} & TelegrafContext;

export type MySessionWizard = MySession & {
	createPromocodeState?: CreatePromocodeState;
} & Scenes.WizardSessionData;

export type MyContextWizard = MyBaseContext & {
	session: MySessionWizard;
} & Scenes.WizardContext;

export type MyContext = MyBaseContext & Scenes.SceneContext;

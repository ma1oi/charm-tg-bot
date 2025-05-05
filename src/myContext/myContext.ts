import { Context as TelegrafContext, Scenes } from 'telegraf';

type OrderData = {
	product?: string;
	descriptionProduct?: string;
	promocode?: string;
	promocodeName?: string;
	orderId?: number;
	chosenArtistName?: string;
};

export type CreatePromocodeState = {
	code?: string;
	discountType?: 'fixed' | 'percent';
	discountValue?: number;
	maxUses?: number | null;
	usageLimit?: number;
};

export type HireArtistState = {
	tuid: bigint;
	name: string;
	category: string;
	imgUrl: string;
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
	hireArtistState?: HireArtistState;
} & Scenes.WizardSessionData;

export type MyContextWizard = MyBaseContext & {
	session: MySessionWizard;
} & Scenes.WizardContext;

export type MyContext = MyBaseContext & Scenes.SceneContext;

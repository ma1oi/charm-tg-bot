import { Scenes } from 'telegraf';

type OrderData = {
	product?: string;
	descriptionProduct?: string;
	promocode?: string;
	orderId?: number;
};

export type MySession = {
	orderData?: OrderData;
} & Scenes.SceneSession;

export type MyContext = {
	session: MySession;
} & Scenes.SceneContext;

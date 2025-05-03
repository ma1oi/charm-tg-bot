import { Context as TelegrafContext, Scenes } from 'telegraf';

// --- Данные ---
type OrderData = {
	product?: string;
	descriptionProduct?: string;
	promocode?: string;
	promocodeName?: string;
	orderId?: number;
};

export type CreatePromocodeState = {
	code?: string;
	discountType?: 'fixed' | 'percent'; // Используем литералы, если Prisma ожидает их
	discountValue?: number;
	maxUses?: number | null;
	usageLimit?: number;
};

// --- Базовая Сессия ---
// Включает ваши общие данные сессии + базовые данные для сцен
export type MySession = {
	orderData?: OrderData;
	// Другие ваши поля сессии...
} & Scenes.SceneSession; // Наследуем базовую сессию сцен

// --- Базовый Контекст ---
// Включает базовый контекст Telegraf + вашу базовую сессию + кастомные поля (user)
// НЕ включает SceneContext или WizardContext напрямую здесь
export type MyBaseContext = {
	session: MySession;
	user?: { id: number /* ... другие поля юзера */ }; // Добавляется вашим upsertUserMiddleware
	// Другие кастомные поля контекста...
} & TelegrafContext; // Наследуем базовый контекст Telegraf

// --- Сессия для Wizard ---
// Расширяет базовую сессию И добавляет специфичные для Wizard данные
export type MySessionWizard = MySession & {
	// Если CreatePromocodeState нужно хранить именно в сессии (например, для восстановления между перезапусками)
	// то оставляем здесь. Если только внутри шагов - можно убрать.
	createPromocodeState?: CreatePromocodeState;
} & Scenes.WizardSessionData; // Наследуем данные сессии Wizard

// --- Контекст для Wizard Сцен ---
// Это основной тип для вашего бота и Stage
// Расширяет базовый контекст И WizardContext
export type MyContextWizard = MyBaseContext & {
	// Переопределяем тип сессии на более специфичный для Wizard
	session: MySessionWizard;
} & Scenes.WizardContext; // Наследуем WizardContext (он уже включает SceneContext)

// --- Контекст для Обычных Сцен (Опционально) ---
// Если вам где-то нужен тип только для обычных сцен (без ctx.wizard)
export type MyContext = MyBaseContext & Scenes.SceneContext;

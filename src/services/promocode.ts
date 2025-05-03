import { prisma } from '@config/database';
import { Promocode, PromocodeUsage } from '@prisma/client';

type CreatePromocodeInput = {
	code: string;
	discountType: 'percent' | 'fixed';
	discountValue: number;
	expiresAt?: string;
	maxUses?: number;
};

export const promocodeService = {
	async createPromocode(promocode: CreatePromocodeInput): Promise<CreatePromocodeInput> {
		const created = await prisma.promocode.create({
			data: { ...promocode },
		});

		return { ...created };
	},

	async getPromocodeById(id: number): Promise<CreatePromocodeInput> {
		const promo = await prisma.promocode.findUnique({
			where: { id },
		});

		return { ...promo };
	},

	async getPromocodeByCode(code: string): Promise<Promocode> {
		const promo = await prisma.promocode.findUnique({
			where: { code },
		});

		return { ...promo };
	},

	async getPromocodeUsage(userId: number, promocodeId: number): Promise<Promocode> {
		const promo = await prisma.promocodeUsage.findFirst({
			where: { userId, promocodeId },
		});

		return { ...promo };
	},

	async createPromocodeUsage(promocode: Omit<PromocodeUsage, 'id' | 'usedAt'>): Promise<Promocode> {
		const promo = await prisma.promocodeUsage.create({
			data: { ...promocode },
		});

		return promo;
	},

	async addUsePromocode(id: number): Promise<Promocode> {
		const promo = await prisma.promocode.update({
			where: { id },
			data: {
				usedCount: { increment: 1 },
			},
		});

		return promo;
	},

	async updatePromocode(promocode: Partial<Promocode> & { id: number }): Promise<Promocode> {
		const { id, ...data } = promocode;

		const promo = await prisma.promocode.update({
			where: { id },
			data,
		});

		return promo;
	},
};

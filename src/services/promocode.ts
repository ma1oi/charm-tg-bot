import { prisma } from '@config/database';
import { Promocode } from '@prisma/client';

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
};

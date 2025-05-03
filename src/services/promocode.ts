import { prisma } from '@config/database';
import { Promocode, PromocodeUsage, User } from '@prisma/client';

type CreatePromocodeInput = {
	code: string;
	discountType: 'percent' | 'fixed';
	discountValue: number;
	expiresAt?: string;
	maxUses?: number;
};

export const promocodeService = {
	async createPromocode(promocode: CreatePromocodeInput): Promise<Promocode> {
		const created = await prisma.promocode.create({
			data: { ...promocode },
		});

		return { ...created };
	},

	async getPromocodeById(id: Promocode['id']): Promise<Promocode> {
		const promocode = await prisma.promocode.findUnique({
			where: { id },
		});
		if (!promocode) {
			throw new Error(`Promocode with id ${id} not found`);
		}
		return promocode;
	},

	async getPromocodeByCode(code: Promocode['code']): Promise<Promocode> {
		const promocode = await prisma.promocode.findUnique({
			where: { code },
		});

		if (!promocode) {
			throw new Error(`Promocode with code ${code} not found`);
		}
		return promocode;
	},

	async getPromocodeUsage(userId: User['id'], promocodeId: Promocode['id']): Promise<Promocode> {
		const promocode = await prisma.promocodeUsage.findFirst({
			where: { userId, promocodeId },
		});

		if (!promocode) {
			throw new Error(`Promocode with userId ${userId} or with promocodeId ${promocodeId} not found`);
		}
		return promocode;
	},

	async createPromocodeUsage(promocode: Omit<PromocodeUsage, 'id' | 'usedAt'>): Promise<Promocode> {
		return prisma.promocodeUsage.create({
			data: { ...promocode },
		});
	},

	async addUsePromocode(id: number): Promise<Promocode> {
		return prisma.promocode.update({
			where: { id },
			data: {
				usedCount: { increment: 1 },
			},
		});
	},

	async updatePromocode(promocode: Partial<Promocode> & { id: number }): Promise<Promocode> {
		const { id, ...data } = promocode;

		return prisma.promocode.update({
			where: { id },
			data,
		});
	},

	async getAllPromocodes(): Promise<Promocode[]> {
		return prisma.promocode.findMany({});
	},
};

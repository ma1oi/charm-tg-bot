import { prisma } from '@config/database';
import { Order, OrderStatus } from '@prisma/client';

type OrderInput = {
	description?: string;
	customerId: number;
	customerTuid: bigint;
	nameProduct: string;
	promocode?: string | null;
};

export const orderService = {
	async getOrderById(id: Order['id']) {
		const order = await prisma.order.findUnique({
			where: { id },
		});

		return { ...order };
	},

	async createOrder(order: OrderInput) {
		const createdOrder = await prisma.order.create({
			data: {
				...order,
				artistId: order.artistId || null,
			},
		});

		return { ...createdOrder };
	},

	async getPendingOrder(): Promise<Order | null> {
		const pendingOrder: Order | null = await prisma.order.findFirst({
			where: { status: 'pending' },
		});

		return pendingOrder ? { ...pendingOrder } : null;
	},

	async updateOrder(order: Partial<Order> & { id: number }): Promise<Order> {
		const { id, artistId, status } = order;

		const pendingOrder: Order | null = await prisma.order.update({
			where: { id },
			data: { artistId, status },
		});

		return { ...pendingOrder };
	},

	async getAllActiveArtistOrders(artistId: number): Promise<Order[]> {
		const activeOrders: Order[] = await prisma.order.findMany({
			where: { artistId: artistId, status: OrderStatus.in_progress },
		});

		return { ...activeOrders };
	},
};

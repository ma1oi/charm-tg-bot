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
		if (typeof id !== 'number') {
			throw new Error('Order id is undefined or invalid');
		}

		const order = await prisma.order.findUnique({
			where: { id },
		});

		if (!order) {
			throw new Error(`Order with id ${id} not found`);
		}

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
		const { id, artistId, status, skinFileUrl, completedAt } = order;

		const pendingOrder: Order | null = await prisma.order.update({
			where: { id },
			data: { artistId, status, skinFileUrl, completedAt },
		});

		return { ...pendingOrder };
	},

	async getAllActiveArtistOrders(artistId: number): Promise<Order[]> {
		const activeOrders: Order[] = await prisma.order.findMany({
			where: { artistId: artistId, status: OrderStatus.in_progress },
		});

		return { ...activeOrders };
	},

	async getAllUsersOrdersByTuid(tuid: number): Promise<Order[]> {
		const orders: Order[] = await prisma.order.findMany({
			where: { customerTuid: tuid },
		});

		return { ...orders };
	},
};

import { prisma } from '@config/database';
import { Order } from '@prisma/client';

type OrderInput = Omit<Order, 'id' | 'completedAt' | 'skinFileUrl'>;

export const orderService = {
	async getOrderrById(id: Order['id']) {
		const order = await prisma.order.findUnique({
			where: { id },
		});

		return { ...order };
	},

	async createOrder(order: OrderInput) {

		const createdOrder = await prisma.order.create({
			data: {
				...order,
				artistId: order.artistId || null
			}
		});

		return { ...createdOrder };
	},
}

import { prisma } from '@config/database';
import { Payment } from '@prisma/client';

export const paymentService = {
	async createPayment(payment: Omit<Payment, 'id' | 'updatedAt'>): Promise<void> {
		const payment_ = await prisma.payment.create({
			data: { ...payment },
		});

		return { ...payment_ };
	},

	async getPaymentByOrderId(orderId: number): Promise<Payment> {
		const payment_ = await prisma.payment.findUnique({
			where: { orderId },
		});

		return { ...payment_ };
	},

	async updatePaymentByOrderId(orderId: number, payment: Partial<Payment> & { id: number }): Promise<Payment> {
		const { paymentStatus, updatedAt } = payment;

		const payment_ = await prisma.payment.update({
			where: { orderId },
			data: { paymentStatus, updatedAt },
		});

		return { ...payment_ };
	},
};

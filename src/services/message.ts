import { prisma } from '@config/database';
import { Message } from '@prisma/client';

type CreateMessageInput = {
	orderId: number;
	senderId: number;
	content?: string; // необязательное
	fileUrl?: string; // необязательное
};

export const messageService = {
	async createMessage(message: CreateMessageInput) {
		const createdMessage = await prisma.message.create({
			data: {
				orderId: message.orderId,
				senderId: message.senderId,
				content: message.content ?? null,
				fileUrl: message.fileUrl ?? null,
			},
		});

		return { ...createdMessage };
	},
};

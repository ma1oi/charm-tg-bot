import { prisma } from '@config/database';
import { OrderStatus } from '@prisma/client';

export const artistService = {
	async addArtistToQueue(artistId: number) {
		const added = await prisma.artistQueue.upsert({
			where: { artistId },
			update: {},
			create: { artistId },
		});

		return { ...added };
	},

	async assignOrderToNextArtist(orderId: number) {
		const nextArtist = await prisma.artistQueue.findFirst({
			orderBy: { createdAt: 'asc' },
		});

		if (!nextArtist) {
			// нет художников в очереди todo оповестить админа о том что нет художника
			return;
		}

		await prisma.order.update({
			where: { id: orderId },
			data: { artistId: nextArtist.artistId, status: OrderStatus.in_progress },
		});

		const deletedArtist = await prisma.artistQueue.delete({
			where: { artistId: nextArtist.artistId },
		});

		return deletedArtist;
	},
};

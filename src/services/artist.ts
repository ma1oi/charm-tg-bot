import { prisma } from '@config/database';
import { Order, OrderStatus, Role, User } from '@prisma/client';

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

	async getAllArtists(): Promise<User[]> {
		return prisma.user.findMany({
			where: { role: Role.artist },
		});
	},

	async getCountAllDoneOrderArtist(artistId: User['id']): Promise<number> {
		return prisma.order.count({
			where: { artistId, status: OrderStatus.done },
		});
	},

	async dismissAndHireArtist(artistTuid: User['tuid'], action: 'hire' | 'dismiss'): Promise<User> {
		const role = action === 'hire' ? Role.artist : Role.customer;

		return prisma.user.update({
			where: { tuid: artistTuid },
			data: { role: role },
		});
	},
};

import { prisma } from '@config/database';
import { Artist, ArtistCategory, CategoryProdict, OrderStatus, Role, User } from '@prisma/client';

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

	async createArtist(artist: Omit<Artist, 'id'>): Promise<Artist> {
		return prisma.artist.create({
			data: { ...artist },
		});
	},

	async addArtistToCategory(artist: Omit<ArtistCategory, 'id'>): Promise<ArtistCategory> {
		return prisma.artistCategory.create({
			data: { ...artist },
		});
	},

	async getArtistByName(name: string): Promise<Artist> {
		return prisma.artist.findUnique({
			where: { name },
		});
	},

	async getArtistByUserId(userId: number): Promise<Artist> {
		return prisma.artist.findUnique({
			where: { userId },
		});
	},

	async getArtistsByCategory(category: string): Promise<ArtistCategory[]> {
		return prisma.artistCategory.findMany({
			where: { category },
		});
	},

	async getCategoryByName(name: string): Promise<CategoryProdict> {
		return prisma.categoryProdict.findUnique({
			where: { name },
		});
	},
};

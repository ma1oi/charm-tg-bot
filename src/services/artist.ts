import { prisma } from '@config/database';

export const artistService = {
	async addArtistToQueue(artistId: number) {
		const added = await prisma.artistQueue.upsert({
			where: { artistId },
			update: {},
			create: { artistId },
		});

		return { ...added };
	},
};

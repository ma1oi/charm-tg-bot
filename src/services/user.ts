import { User } from '@prisma/client';
import { prisma } from '@config/database';

export const userService = {
	async getUserById(id: User['id']) {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		return { ...user };
	},

	async upsertUser(user: User) {
		const upsertUser = await prisma.user.upsert({
			where: { tuid: BigInt(user.tuid) },
			update: { ...user },
			create: { ...user },
		});

		return { ...upsertUser };
	},
}

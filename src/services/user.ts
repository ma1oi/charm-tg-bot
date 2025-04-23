import { prisma } from '@config/database';
import { User } from '@prisma/client';

type UserInput = Omit<User, 'id' | 'role'>;

export const userService = {
	async getUserById(id: User['id']) {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		return { ...user };
	},

	async getUserByTuid(tuid: User['tuid']) {
		const user = await prisma.user.findUnique({
			where: { tuid },
		});

		if (!user) {
			throw new Error('User not found');
		}

		return { ...user };
	},

	async upsertUser(user: UserInput) {
		const { name, username, tuid } = user

		const upsertUser = await prisma.user.upsert({
			where: { tuid },
			update: { name, username },
			create: { ...user },
		});

		return { ...upsertUser };
	},
}

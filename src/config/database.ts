import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'development') {
	// prisma.$use(async (params, next) => {
	// 	console.log('Query:', params.model, params.action);
	// 	return next(params);
	// });
}

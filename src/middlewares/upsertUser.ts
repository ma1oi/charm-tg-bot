import { userService } from '@services/user';
import { Context, MiddlewareFn } from 'telegraf';

export const upsertUserMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
	if (ctx.from) {
		await userService.upsertUser({
			tuid: BigInt(ctx.from.id),
			username: ctx.from.username ?? '',
			name: `${ctx.from.first_name ?? ''} ${ctx.from.last_name ?? ''}`.trim(),
		});
	}
	await next();
};

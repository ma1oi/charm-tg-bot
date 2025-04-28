import { MyContext } from '@myContext/myContext';

export function assertFrom(ctx: MyContext): asserts ctx is MyContext & {
	from: NonNullable<MyContext['from']>;
	session: MyContext['session'] & { orderData: NonNullable<MyContext['session']['orderData']> };
} {
	if (!ctx.from) {
		throw new Error('ctx.from is undefined');
	}
	if (!ctx.session.orderData) {
		throw new Error('ctx.session.orderData is undefined');
	}
}

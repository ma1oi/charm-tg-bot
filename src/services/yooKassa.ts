import { appConfig } from '@config/app';

type yooPayment = {
	id: string;
	confirmation: {
		confirmation_url: string;
	};
	status: 'pending' | 'succeeded' | 'canceled ';
};

export const yooKassaService = {
	async createPayment(amount: number, description: string, orderId: number): Promise<yooPayment> {
		const username = appConfig.yooKassaUsername;
		const password = appConfig.yooKassaPassword;
		const auth = Buffer.from(`${username}:${password}`).toString('base64');

		const response = await fetch(appConfig.yooKassaApiUrl + 'payments', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${auth}`,
				'Content-Type': 'application/json',
				'Idempotence-Key': orderId.toString(),
			},
			body: JSON.stringify({
				amount: {
					value: `${amount.toFixed(2)}`,
					currency: 'RUB',
				},
				capture: true,
				confirmation: {
					type: 'redirect',
					return_url: 'https://t.me/charm_test_new_bot',
				},
				description: 'Charm',
				receipt: {
					customer: {
						email: 'unknown@email.com',
						phone: '+7999999999',
					},
					email: 'unknown@email.com',
					items: [
						{
							amount: {
								currency: 'RUB',
								value: `${amount.toFixed(2)}`,
							},
							description: 'Charm',
							payment_mode: 'full_payment',
							payment_subject: 'service',
							quantity: '1.0',
							vat_code: 1,
						},
					],
					phone: '+7999999999',
				},
				transfers: [],
			}),
		});

		const data = await response.json();

		return data;
	},

	async getPayment(yooId: string): Promise<yooPayment> {
		const username = appConfig.yooKassaUsername;
		const password = appConfig.yooKassaPassword;
		const auth = Buffer.from(`${username}:${password}`).toString('base64');

		const response = await fetch(appConfig.yooKassaApiUrl + 'payments/' + yooId, {
			method: 'get',
			headers: {
				Authorization: `Basic ${auth}`,
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();

		return data;
	},
};

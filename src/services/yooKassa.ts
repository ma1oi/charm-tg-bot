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
				description: description,
				test: true,
			}),
		});

		const data = await response.json();
		console.log(data);

		return data;
	},

	async getPayment(yooId: string): Promise<yooPayment> {
		const username = 1069979;
		const password = 'live_gE3vsKenED_VRGGvnLHutq6p9FLYzwYNLMTcu7LsNvE';
		const auth = Buffer.from(`${username}:${password}`).toString('base64');

		const response = await fetch(appConfig.yooKassaApiUrl + 'payments/' + yooId, {
			method: 'get',
			headers: {
				Authorization: `Basic ${auth}`,
				'Content-Type': 'application/json',
				// другие хидеры, если нужны
			},
		});

		const data = await response.json();
		console.log(data);

		return data;
	},
};

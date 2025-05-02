function getEnv(key: string): string {
	const value = process.env[key];

	if (!value) {
		throw new Error(`Missing environment variable: ${key}`);
	}

	return value;
}

export const appConfig = {
	botToken: getEnv('BOT_TOKEN'),
	databaseUrl: getEnv('DATABASE_URL'),
	redisPassword: getEnv('REDIS_PASSWORD'),
	redisPort: getEnv('REDIS_PORT'),
	redisHost: getEnv('REDIS_HOST'),
};

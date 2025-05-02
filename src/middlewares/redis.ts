import { appConfig } from '@config/app';
import { Redis } from '@telegraf/session/redis';

const HOST = appConfig.redisHost;
const PORT = appConfig.redisPort;
const PASSWORD = appConfig.redisPassword;

const redisUrl = `redis://:${PASSWORD}@${HOST}:${PORT}`;

export const redisStore = Redis({
	url: redisUrl,
});

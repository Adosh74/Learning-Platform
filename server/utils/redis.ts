import { config } from 'dotenv';
import { Redis } from 'ioredis';

config({ path: './.env' });

const redisClient = () => {
	if (!process.env.REDIS_URI) {
		throw new Error('REDIS_URI is not defined');
	}
	console.log('redis connected successfully!');

	return process.env.REDIS_URI;
};
export const redis = new Redis(redisClient());

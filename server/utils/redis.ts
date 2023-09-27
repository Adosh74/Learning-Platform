import { Redis } from 'ioredis';

const redisClient = () => {
	if (!process.env.REDIS_URI) throw new Error('REDIS_URI is not defined');
	return process.env.REDIS_URI;
};
export const redis = new Redis(redisClient());

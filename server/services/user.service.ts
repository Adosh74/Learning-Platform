import { Response } from 'express';
import { redis } from '../utils/redis';

// get user by id
export const getUserById = async (id: string, res: Response) => {
	const userString = await redis.get(id);

	const user = JSON.parse(userString as string);

	res.status(200).json({
		success: true,
		user,
	});
};

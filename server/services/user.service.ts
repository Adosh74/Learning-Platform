import { Response } from 'express';
import { redis } from '../utils/redis';

// get user by id
export const getUserById = async (id: string, res: Response) => {
	const user = await redis.get(id);

	res.status(200).json({
		success: true,
		user,
	});
};

import { Response } from 'express';
import User from '../models/user.model';

// get user by id
export const getUserById = async (id: string, res: Response) => {
	const user = await User.findById(id);

	res.status(200).json({
		success: true,
		user,
	});
};

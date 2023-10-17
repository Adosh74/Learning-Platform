import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import { getUserById } from '../services/user.service';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsync } from '../utils/catchAsyncError';
import { redis } from '../utils/redis';

export const getMe = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user?._id;
		getUserById(userId as string, res);
	}
);

// update user info
interface IUpdateUserInfo {
	name?: string;
	email?: string;
}

export const updateUserInfo = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, email }: IUpdateUserInfo = req.body as IUpdateUserInfo;
		const userId = req.user?._id;

		const user: IUser = (await User.findById(userId)) as IUser;

		// check if email is already used
		if (email && user) {
			const isEmailExist = await User.findOne({ email });
			if (isEmailExist) {
				return next(new ErrorHandler('Email already exists', 400));
			}
			user.email = email;
		}

		// update name
		if (name && user) {
			user.name = name;
		}

		// save user and update cache
		await user.save();

		await redis.set(userId || '', JSON.stringify(user));

		res.status(200).json({
			success: true,
			user,
		});
	}
);

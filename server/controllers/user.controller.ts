import cloudinary from 'cloudinary';
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

interface IUpdateProfilePicture {
	avatar: string;
}
// *** update profile picture *** //
export const updateProfilePicture = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { avatar }: IUpdateProfilePicture = req.body as IUpdateProfilePicture;

		if (!avatar) {
			return next(new ErrorHandler('Please provide an avatar', 400));
		}

		const userId = req.user?._id;

		const user: IUser = (await User.findById(userId)) as IUser;
		if (!user) {
			return next(new ErrorHandler('User not found', 404));
		}

		// if user already has an avatar, delete it
		if (user.avatar.public_id) {
			await cloudinary.v2.uploader.destroy(user.avatar.public_id);
		}

		// then upload new avatar and save it to user
		const myCloudinary = await cloudinary.v2.uploader.upload(avatar, {
			folder: 'avatars',
			width: 150,
		});

		user.avatar = {
			public_id: myCloudinary.public_id,
			url: myCloudinary.secure_url,
		};

		await user.save();
		await redis.set(userId || '', JSON.stringify(user));

		res.status(200).json({
			success: true,
			user,
		});
	}
);

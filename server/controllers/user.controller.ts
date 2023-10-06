import { NextFunction, Request, Response } from 'express';
import { getUserById } from '../services/user.service';
import { catchAsync } from '../utils/catchAsyncError';

export const getMe = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user?._id;
		getUserById(userId as string, res);
	}
);

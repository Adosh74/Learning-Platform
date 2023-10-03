import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsync } from '../utils/catchAsyncError';
import { redis } from '../utils/redis';

/// *** Authenticated User *** ///
export const isAuthenticated = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// 1) Getting token from cookie and check of it's there
		const accessToken = req.cookies.access_token;

		if (!accessToken) {
			return next(
				new ErrorHandler(
					'You are not logged in! Please log in to get access',
					401
				)
			);
		}

		// 2) Verification token
		const decode: any = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		) as JwtPayload;

		// 3) Check if user still exists
		const freshUser: any = await redis.get(decode.id);

		if (!freshUser) {
			return next(
				new ErrorHandler(
					'The user belonging to this token does no longer exist.',
					401
				)
			);
		}

		// 4) Check if user changed password after the token was issued
		if (
			freshUser.passwordChangedAt &&
			decode.iat < freshUser.passwordChangedAt.getTime() / 1000
		) {
			return next(
				new ErrorHandler(
					'User recently changed password! Please log in again.',
					401
				)
			);
		}

		// 5) Grant access to protected route and store user in req.user

		req.user = JSON.parse(freshUser);
		next();
	}
);

/// *** Authorization Role *** ///

export const authorizeRoles = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user?.role || '')) {
			return next(
				new ErrorHandler(
					`(${req.user?.role}) do not have permission to perform this action`,
					403
				)
			);
		}
		next();
	};
};

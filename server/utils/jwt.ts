import { Response } from 'express';
import { IUser } from '../models/user.model';
import { redis } from './redis';

interface ITokenOptions {
	expires: Date;
	maxAge: number;
	httpOnly: boolean;
	sameSite: 'strict' | 'lax' | 'none' | undefined;
	secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
	const accessToken = user.SignAccessToken();
	const refreshToken = user.SignRefreshToken();

	// upload session to redis
	redis.set(user._id, JSON.stringify(user));

	// pares environment variables to integer with fallback values
	const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '300', 10);
	const refreshTokenExpire = parseInt(
		process.env.REFRESH_TOKEN_EXPIRES_IN || '86400',
		10
	);

	// cookies options
	const accessTokenOptions: ITokenOptions = {
		expires: new Date(Date.now() + accessTokenExpire * 1000),
		maxAge: accessTokenExpire * 1000,
		httpOnly: true,
		sameSite: 'lax',
	};

	const refreshTokenOptions: ITokenOptions = {
		expires: new Date(Date.now() + refreshTokenExpire * 1000),
		maxAge: refreshTokenExpire * 1000,
		httpOnly: true,
		sameSite: 'lax',
	};

	// set secure for 'production' only
	if (process.env.NODE_ENV === 'production') {
		accessTokenOptions.secure = true;
	}

	// set cookies to response
	res.cookie('access_token', accessToken, accessTokenOptions);
	res.cookie('refresh_token', refreshToken, refreshTokenOptions);

	res.status(statusCode).json({
		success: true,
		user,
		accessToken,
	});
};
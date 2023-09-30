import ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import path from 'path';
import User, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsync } from '../utils/catchAsyncError';
import sendMail from '../utils/mail';

interface IRegistrationBody {
	name: string;
	email: string;
	password: string;
	avatar?: string;
}

export const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 1. destructure req.body and check if fields are not empty and mail is not already used
			const { name, email, password }: IRegistrationBody = req.body;

			if (!name || !email || !password) {
				return next(new ErrorHandler('Please fill all fields', 400));
			}

			const isEmailExist = await User.findOne({ email });
			if (isEmailExist) {
				return next(new ErrorHandler('Email already exists', 400));
			}

			// 2. create activation token and send email
			const user: IRegistrationBody = {
				name,
				email,
				password,
			};
			const activationToken = createActivationToken(user);

			const activationCode = activationToken.activationCode;
			const data = { user: { name: user.name }, activationCode };
			const html = await ejs.renderFile(
				path.join(__dirname, './../mails/activation-mail.ejs'),
				data
			);

			await sendMail({
				email: user.email,
				subject: 'Account Activation',
				template: 'activation-mail.ejs',
				data,
			});

			res.status(201).json({
				success: true,
				message: `Please check your email: ${user.email} to activate your account`,
				activationToken: activationToken.token,
			});
		} catch (error: any) {
			console.log(error);
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

interface IActivationToken {
	token: string;
	activationCode: string;
}

const createActivationToken = (user: IRegistrationBody): IActivationToken => {
	const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

	const token = jwt.sign(
		{ user, activationCode },
		process.env.ACTIVATION_SECRET as Secret,
		{
			expiresIn: '10m',
		}
	);

	return { token, activationCode };
};

interface IActivationRequest {
	activation_token: string;
	activation_code: string;
}

export const activateUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 1. destructure activation_token and activation_code from req.body
			const { activation_code, activation_token }: IActivationRequest = req.body;

			// 2. verify activation_token
			const newUser: { user: IUser; activationCode: string } = jwt.verify(
				activation_token,
				process.env.ACTIVATION_SECRET as string
			) as { user: IUser; activationCode: string };

			// 3. check if activation_code is correct
			if (newUser.activationCode !== activation_code) {
				return next(new ErrorHandler('Invalid activation code', 401));
			}

			// 4. destructure newUser and save to database
			const { name, email, password } = newUser.user;

			// 5. check if user already exists
			const existUser = await User.findOne({ email });
			if (existUser) {
				return next(new ErrorHandler('Email already exists', 400));
			}

			// 6. save user to database
			const user = await User.create({ name, email, password });

			res.status(201).json({
				success: true,
				message: 'Account activated successfully',
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

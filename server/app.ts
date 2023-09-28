import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response, request } from 'express';
import { ErrorMiddleware } from './middleware/error';
import ErrorHandler from './utils/ErrorHandler';

dotenv.config({ path: './.env' });

export const app = express();

// body-parser
app.use(express.json({ limit: '50mb' }));

// cookie-parser
app.use(cookieParser());

// cors
app.use(cors({ origin: [`${process.env.ORIGIN}`] }));

// test apis
app.get('/xyz', (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: 'SERVER WORKING!',
	});
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
	const err: any = new ErrorHandler(
		`Can't find ${req.originalUrl} on this server!`,
		404
	);
	next(err);
});

app.use(ErrorMiddleware);

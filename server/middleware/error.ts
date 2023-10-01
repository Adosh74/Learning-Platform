import { Response, Request, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export const ErrorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (process.env.NODE_ENV === 'development') {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Error';

	// wrong mongoose object id error
	if (err.name === 'CastError') {
		const message = `Resource not found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	//duplicate key error
	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
		err = new ErrorHandler(message, 400);
	}

	// wrong jwt error
	if (err.name === 'JsonWebTokenError') {
		const message = 'JSON Web Token is invalid. Try again!';
		err = new ErrorHandler(message, 401);
	}

	// jwt expired error
	if (err.name === 'TokenExpiredError') {
		const message = 'JSON Web Token is expired. Try again!';
		err = new ErrorHandler(message, 401);
	}

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};

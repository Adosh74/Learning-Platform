import { NextFunction, Request, Response } from 'express';

export const catchAsyncError = (func: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(func(req, res, next)).catch(next);
	};
};

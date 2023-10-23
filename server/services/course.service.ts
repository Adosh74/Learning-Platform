import { Response, NextFunction } from 'express';
import Course, { ICourse } from '../models/course.model';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsync } from '../utils/catchAsyncError';

// *** create course *** //
export const createCourse = catchAsync(async (data: ICourse, res: Response) => {
	const course = await Course.create(data);
	res.status(201).json({
		success: true,
		course,
	});
});

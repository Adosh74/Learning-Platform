import cloudinary from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import Course from '../models/course.model';
import { createCourse } from '../services/course.service';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsync } from '../utils/catchAsyncError';

// *** upload course *** //
export const uploadCourse = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		// handle course thumbnail
		const thumbnail = data.thumbnail;
		if (thumbnail) {
			const uploadResponse = await cloudinary.v2.uploader.upload(thumbnail, {
				folder: 'courses',
				quality: 'auto',
				fetch_format: 'auto',
			});
			data.thumbnail = {
				public_id: uploadResponse.public_id,
				url: uploadResponse.secure_url,
			};
		}

		createCourse(data, res, next);
	}
);

// *** update course *** //
export const updateCourse = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;

		// if user upload new thumbnail
		const thumbnail = data.thumbnail;

		if (thumbnail) {
			await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);
			const uploadResponse = await cloudinary.v2.uploader.upload(thumbnail, {
				folder: 'courses',
				quality: 'auto',
				fetch_format: 'auto',
			});

			data.thumbnail = {
				public_id: uploadResponse.public_id,
				url: uploadResponse.secure_url,
			};
		}

		// find course and update
		const courseId = req.params.id;
		const course = await Course.findByIdAndUpdate(
			courseId,
			{ $set: data },
			{
				new: true,
				runValidators: true,
			}
		);

		if (!course) {
			return next(new ErrorHandler('Course not found', 404));
		}

		res.status(200).json({
			success: true,
			course,
		});
	}
);

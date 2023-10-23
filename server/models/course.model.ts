import mongoose, { Document, Model, Schema } from 'mongoose';

interface IComment extends Document {
	user: object;
	comment: string;
	commentReplies?: IComment[];
}

interface IReview extends Document {
	user: object;
	rating: number;
	comment: string;
	commentReplies: IComment[];
}

interface ILink extends Document {
	title: string;
	url: string;
}

interface ICourseData extends Document {
	title: string;
	description: string;
	videoUrl: string;
	videoThumbnail: object;
	videoSection: string;
	videoLength: number;
	videoPlayer: string;
	links: ILink[];
	suggestion: string;
	questions: IComment[];
}

export interface ICourse extends Document {
	name: string;
	description: string;
	price: number;
	estimatedPrice?: number;
	thumbnail: object;
	tags: string;
	level: string;
	demoUrl: string;
	benefits: { title: string }[];
	prerequisites: { title: string }[];
	reviews: IReview[];
	courseData: ICourseData[];
	ratings?: number;
	purchased?: number;
}

const reviewSchema = new Schema<IReview>({
	user: Object,
	rating: {
		type: Number,
		default: 0,
		min: [1, 'Rating must be at least 1'],
		max: [5, 'Rating must can not be more than 5'],
	},
	comment: String,
});

const linkSchema = new Schema<ILink>({
	title: String,
	url: String,
});

const commentSchema = new Schema<IComment>({
	user: Object,
	comment: String,
	commentReplies: [Object],
});

const courseDataSchema = new Schema<ICourseData>({
	title: String,
	description: String,
	videoUrl: String,
	videoThumbnail: Object,
	videoSection: String,
	videoLength: Number,
	videoPlayer: String,
	links: [linkSchema],
	suggestion: String,
	questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
	name: {
		type: String,
		required: [true, 'Please enter course name'],
		trim: true,
		maxLength: [100, 'Course name cannot exceed 100 characters'],
	},
	description: {
		type: String,
		required: [true, 'Please enter course description'],
		trim: true,
		maxLength: [2000, 'Course description cannot exceed 2000 characters'],
	},
	price: {
		type: Number,
		required: [true, 'Please enter course price'],
		default: 0.0,
		min: [0, 'Price cannot be less than 0.0'],
	},
	estimatedPrice: Number,
	thumbnail: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	tags: {
		type: String,
		required: [true, 'Please enter course tags'],
	},
	level: {
		type: String,
		required: [true, 'Please enter course level'],
	},
	demoUrl: {
		type: String,
		required: [true, 'Please enter course demo url'],
	},
	benefits: [{ title: String }],
	prerequisites: [{ title: String }],
	reviews: [reviewSchema],
	courseData: [courseDataSchema],
	ratings: {
		type: Number,
		default: 0,
	},
	purchased: {
		type: Number,
		default: 0,
	},
});

const Course: Model<ICourse> = mongoose.model('Course', courseSchema);

export default Course;

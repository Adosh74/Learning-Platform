import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document, Model } from 'mongoose';

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	avatar: {
		public_id: string;
	};
	role: string;
	isVerified: boolean;
	courses: Array<{ courseId: string }>;
	comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please enter your email'],
			unique: true,
			validate: {
				validator: function (v: string) {
					return emailRegex.test(v);
				},
				message: (props: any) => `${props.value} is not a valid email address`,
			},
		},
		password: {
			type: String,
			required: [true, 'Please enter your password'],
			minlength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		avatar: {
			public_id: String,
			url: String,
		},
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin'],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		courses: [
			{
				courseId: String,
			},
		],
	},
	{
		timestamps: true,
	}
);

// Encrypt password before saving user
userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Compare user password with hashed password in database
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model('User', userSchema);

export default User;

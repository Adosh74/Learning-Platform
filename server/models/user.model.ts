import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import mongoose, { Schema, Document, Model } from 'mongoose';

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
	_id: string;
	name: string;
	email: string;
	password: string;
	passwordChangedAt: Date;
	avatar: {
		public_id: string;
	};
	role: string;
	isVerified: boolean;
	courses: Array<{ courseId: string }>;
	comparePassword: (password: string) => Promise<boolean>;
	SignAccessToken: () => string;
	SignRefreshToken: () => string;
	changedPasswordAfter: (JWTTimestamp: number) => boolean;
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
		passwordChangedAt: Date,
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

// Update passwordChangedAt property for the user
userSchema.pre<IUser>('save', function (next) {
	if (!this.isModified('password') || this.isNew) {
		return next();
	}

	this.passwordChangedAt = new Date(Date.now() - 1000);
	next();
});

// Sign access token
userSchema.methods.SignAccessToken = function (): string {
	return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET as Secret);
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function (): string {
	return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET as Secret);
};

// Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
	if (this.passwordChangedAt) {
		const time = `${this.passwordChangedAt.getTime() / 1000}`;
		const changedTimestamp = parseInt(time, 10);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

// Compare user password with hashed password in database
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model('User', userSchema);

export default User;

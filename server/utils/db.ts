import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined');
		mongoose
			.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log(
					`MongoDB connected successfully with ${process.env.MONGO_DB?.toUpperCase()}!`
				);
			});
	} catch (error) {
		console.log(error);
		setTimeout(connectDB, 5000);
	}
};

export default connectDB;

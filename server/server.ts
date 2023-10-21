import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { app } from './app';
import connectDB from './utils/db';

// cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET_KEY,
});

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;

connectDB();
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

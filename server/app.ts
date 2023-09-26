import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

export const app = express();

// body-parser
app.use(express.json({ limit: '50mb' }));

// cookie-parser
app.use(cookieParser());

// cors
app.use(cors({ origin: true, credentials: true }));

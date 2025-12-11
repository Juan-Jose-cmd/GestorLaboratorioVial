import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.router';

export const server = express();

server.use(cors());

server.use(morgan("dev"));

server.use(express.json());

server.use('/api', router);

server.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'run' });
});
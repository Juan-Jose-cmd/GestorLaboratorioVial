import express from 'express';
import { Request, Response } from 'express';

export const server = express();

server.use(express.json());

server.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'run' });
});
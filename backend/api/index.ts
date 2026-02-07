import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

export default async (req: VercelRequest, res: VercelResponse) => {
    return app(req, res);
};

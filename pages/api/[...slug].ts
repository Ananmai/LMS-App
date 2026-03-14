import type { NextApiRequest, NextApiResponse } from 'next';
import app from '../../backend/src/app';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    return (app as any)(req, res);
  } catch (error: any) {
    console.error('API_HANDLER_CRASH:', error);
    res.status(500).json({ 
        error: 'Background API Server Error', 
        message: error.message,
        path: req.url 
    });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Dynamically loading the app inside the handler to prevent crashing the whole routing system
    const app = require('../../backend/src/app').default;
    return app(req, res);
  } catch (error: any) {
    console.error('API INIT ERROR:', error);
    res.status(500).json({ error: 'Failed to initialize API from backend', details: error.message, stack: error.stack });
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

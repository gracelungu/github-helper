import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, query, body, headers } = req;

    if (!headers.authorization) {
      return res.status(401).json({ message: 'Authorization header not provided' });
    }

    const apiUrl = `${GITHUB_API_BASE_URL}${query.pathname}`;

    const response = await axios({
      method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      url: apiUrl,
      headers: {
        ...headers,
        'User-Agent': 'GitHub Proxy', // Replace with your own User-Agent
      },
      data: body,
    });

    res.status(response.status).json(response.data);
  } catch (error:any) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default handler;

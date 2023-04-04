import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const path = Array.isArray(slug) ? slug.join('/') : slug;

  try {
    const response = await axios.request({
      method: req.method,
      url: `https://api.github.com/${path}`,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error:any) {
    console.error(error);
    res.status(error.response?.status || 500).json(error.response?.data);
  }
}

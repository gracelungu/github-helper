import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
    const repos = response.data.map((repo: any) => ({ name: repo.name, url: repo.html_url }));
    res.status(200).json(repos);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

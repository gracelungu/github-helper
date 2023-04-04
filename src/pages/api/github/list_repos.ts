
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const listRepos = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    const repos = response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
    }));

    return res.status(200).json(repos);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error fetching repositories' });
  }
};

export default listRepos;


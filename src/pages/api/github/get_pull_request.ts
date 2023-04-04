
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const getPullRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, pull_number } = req.query;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !pull_number) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error fetching pull request' });
  }
};

export default getPullRequest;

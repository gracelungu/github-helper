
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const createPullRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, title, body, head, base } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !title || !head || !base) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      title,
      body,
      head,
      base,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating pull request' });
  }
};

export default createPullRequest;

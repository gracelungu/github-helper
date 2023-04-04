
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const createCommit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, message, tree, parents } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !message || !tree || !parents) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Create the commit
    const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      message,
      tree,
      parents,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(201).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating commit' });
  }
};

export default createCommit;


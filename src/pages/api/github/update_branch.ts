
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const updateBranch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, branch, newBase } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !branch || !newBase) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Update the branch
    const response = await axios.patch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      sha: newBase,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error updating branch' });
  }
};

export default updateBranch;

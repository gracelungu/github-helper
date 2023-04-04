
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const createBranch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, newBranchName, baseRef } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !newBranchName || !baseRef) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Get the base reference commit SHA
    const baseRefResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseRef}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });
    const baseRefSha = baseRefResponse.data.object.sha;

    // Create the new branch
    const newBranchResponse = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${newBranchName}`,
      sha: baseRefSha,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(201).json(newBranchResponse.data);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error creating branch' });
  }
};

export default createBranch;

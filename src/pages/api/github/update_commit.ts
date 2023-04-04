
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const updateCommit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, branch, commitSHA, message, tree, parents } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !branch || !commitSHA || !message || !tree || !parents) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Create a new commit with the updated content
    const newCommitResponse = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      message,
      tree,
      parents,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    const newCommitSHA = newCommitResponse.data.sha;

    // Update the branch reference to point to the new commit
    const updateBranchResponse = await axios.patch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      sha: newCommitSHA,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(200).json(updateBranchResponse.data);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating commit' });
  }
};

export default updateCommit;


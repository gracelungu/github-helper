
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const deleteFile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, path, message, branch } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !path || !message || !branch) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Get the file SHA
    const getFileResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
      params: { ref: branch },
    });

    const fileSHA = getFileResponse.data.sha;

    // Delete the file
    const response = await axios.delete(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
      data: {
        message,
        sha: fileSHA,
        branch,
      },
    });

    return res.status(200).json(response.data);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error deleting file' });
  }
};

export default deleteFile;



import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const addUpdateFile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, path, content, message, branch } = req.body;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !path || !content || !message || !branch) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Check if the file exists
    let fileSHA = null;
    try {
      const getFileResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${token}`,
        },
        params: { ref: branch },
      });

      fileSHA = getFileResponse.data.sha;
    } catch (error:any) {
      if (error.response.status !== 404) {
        return res.status(500).json({ error: 'Error checking file existence' });
      }
    }

    // Create or update the file
    const response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      message,
      content: Buffer.from(content).toString('base64'),
      sha: fileSHA,
      branch,
    }, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error adding or updating file' });
  }
};

export default addUpdateFile;


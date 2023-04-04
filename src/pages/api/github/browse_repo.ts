
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const browseRepo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo, ref, path } = req.query;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'Missing owner or repo' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}${ref ? `?ref=${ref}` : ''}`;
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    });

    const items = response.data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      url: item.html_url,
    }));

    return res.status(200).json(items);
  } catch (error:any) {
    return res.status(500).json({ error: 'Error browsing repository' });
  }
};

export default browseRepo;

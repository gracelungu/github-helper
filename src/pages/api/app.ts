import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const options = {
    hostname: 'api.github.com',
    path: req.url,
    // headers: {
    //   'User-Agent': 'GitHub Helper',
    //   Authorization: `token ${process.env.GITHUB_TOKEN}`,
    // },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(err);
    res.status(500).end();
  });

  req.pipe(proxyReq);
}

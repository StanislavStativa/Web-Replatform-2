import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.OPTIVERSAL_URL}/sitemap.xml`);
    const data = await response.text();

    res.setHeader('Content-Type', 'application/xml');
    // 2h cache time
    res.setHeader(
      'Cache-Control',
      'public, max-age=7200, s-maxage=7200, stale-while-revalidate=7200'
    );
    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    res.status(500).json({ error: 'Failed to fetch sitemap' });
  }
}

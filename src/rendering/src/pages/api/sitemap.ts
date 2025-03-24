import type { NextApiRequest, NextApiResponse } from 'next';
import {
  AxiosDataFetcher,
  GraphQLSitemapXmlService,
  AxiosResponse,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { siteResolver } from 'lib/site-resolver';
import config from 'temp/config';

interface ProductSitemap {
  ProductCode: string;
  Link: string;
}
const ABSOLUTE_URL_REGEXP = '^(?:[a-z]+:)?//';

const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return match;
    }
  });
};

const sitemapApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  const {
    query: { id },
  } = req;

  // Resolve site based on hostname
  const hostName = req.headers['host']?.split(':')[0] || 'localhost';
  const site = siteResolver.getByHost(hostName);

  // create sitemap graphql service
  const sitemapXmlService = new GraphQLSitemapXmlService({
    endpoint: config.graphQLEndpoint,
    apiKey: config.sitecoreApiKey,
    siteName: site.name,
  });

  // if url has sitemap-{n}.xml type. The id - can be null if it's sitemap.xml request
  const sitemapPath = await sitemapXmlService.getSitemap(id as string);

  // if sitemap is match otherwise redirect to 404 page
  if (sitemapPath) {
    const isAbsoluteUrl = sitemapPath.match(ABSOLUTE_URL_REGEXP);
    const sitemapUrl = isAbsoluteUrl ? sitemapPath : `${config.sitecoreApiHost}${sitemapPath}`;
    res.setHeader('Content-Type', 'text/xml;charset=utf-8');
    let externalSitemaps = '';
    // Fetch product sitemaps from external API
    const productResponse = await fetch(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL}/api/Product/GetProductSitemaps`
    );
    if (!productResponse.ok) {
      throw new Error(`Failed to fetch product sitemap data: ${productResponse.status}`);
    }

    const productData: { Results: ProductSitemap[] } = await productResponse.json();
    const reqtHostProduct = req.headers.host;
    const reqProtocolProduct = req.headers['x-forwarded-proto'] || 'https';
    res.setHeader('Content-Type', 'text/xml;charset=utf-8');
    // Generate sitemap entries from the external API data
    externalSitemaps =
      productData?.Results?.map((item: ProductSitemap) => {
        return `<url>
        <loc>${escapeXml(`${reqProtocolProduct}://${reqtHostProduct}${item?.Link}`)}</loc>
      </url>`;
      }).join('') || '';

    // need to prepare stream from sitemap url
    return new AxiosDataFetcher()
      .get(sitemapUrl, {
        responseType: 'stream',
      })
      .then((response: AxiosResponse) => {
        let sitemapXml = '';
        // Collect the streamed XML response from the first API
        response.data.on('data', (chunk: Buffer) => {
          sitemapXml += chunk.toString();
        });
        response.data.on('end', () => {
          // Check if the sitemap is valid and contains the <urlset> tag
          if (sitemapXml.includes('</urlset>')) {
            // Insert external product sitemaps before closing </urlset> tag
            sitemapXml = sitemapXml.replace('</urlset>', `${externalSitemaps}</urlset>`);
          } else {
            // If the response is malformed or missing the <urlset> tag
            console.error('Invalid sitemap format');
            return res.status(500).send('Invalid sitemap format');
          }
          // Send the final combined sitemap to the client
          res.write(sitemapXml);
          res.end();
        });
      })
      .catch(() => res.redirect('/404'));
  }

  // this approache if user go to /sitemap.xml - under it generate xml page with list of sitemaps
  const sitemaps = await sitemapXmlService.fetchSitemaps();
  if (!sitemaps.length) {
    return res.redirect('/404');
  }

  const reqtHost = req.headers.host;
  const reqProtocol = req.headers['x-forwarded-proto'] || 'https';
  const SitemapLinks = sitemaps
    .map((item) => {
      const parseUrl = item.split('/');
      const lastSegment = parseUrl[parseUrl.length - 1];

      return `<sitemap>
        <loc>${reqProtocol}://${reqtHost}/${lastSegment}</loc>
      </sitemap>`;
    })
    .join('');

  res.setHeader('Content-Type', 'text/xml;charset=utf-8');
  return res.send(`
  <sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9" encoding="UTF-8">${SitemapLinks}</sitemapindex>
  `);
};

export default sitemapApi;

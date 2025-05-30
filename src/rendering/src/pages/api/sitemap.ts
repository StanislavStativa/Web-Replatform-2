import type { NextApiRequest, NextApiResponse } from 'next';
import { NativeDataFetcher, GraphQLSitemapXmlService } from '@sitecore-jss/sitecore-jss-nextjs';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';
import config from '@/temp/config';

const ABSOLUTE_URL_REGEXP = '^(?:[a-z]+:)?//';

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
    clientFactory,
    siteName: site.name,
  });

  // if url has sitemap-{n}.xml type. The id - can be null if it's sitemap.xml request
  const sitemapPath = await sitemapXmlService.getSitemap(id as string);

  // if sitemap is match otherwise redirect to 404 page
  if (sitemapPath) {
    const isAbsoluteUrl = sitemapPath.match(ABSOLUTE_URL_REGEXP);
    const sitemapUrl = isAbsoluteUrl ? sitemapPath : `${config.sitecoreApiHost}${sitemapPath}`;
    res.setHeader('Content-Type', 'text/xml;charset=utf-8');
    // Fetch product sitemaps from external API
    const productResponse = await fetch(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL}/api/Product/GetProductSitemaps`
    );
    if (!productResponse.ok) {
      throw new Error(`Failed to fetch product sitemap data: ${productResponse.status}`);
    }

    res.setHeader('Content-Type', 'text/xml;charset=utf-8');

    try {
      const fetcher = new NativeDataFetcher();
      const xmlResponse = await fetcher.fetch<string>(sitemapUrl);
      return res.send(xmlResponse.data);
    } catch (error) {
      return res.redirect('/404');
    }
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

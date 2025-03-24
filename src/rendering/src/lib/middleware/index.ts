import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { debug } from '@sitecore-jss/sitecore-jss-nextjs/middleware';
import * as plugins from 'temp/middleware-plugins';
import { XMLParser } from 'fast-xml-parser'; // Import fast-xml-parser
export interface MiddlewarePlugin {
  /**
   * Detect order when the plugin should be called, e.g. 0 - will be called first (can be a plugin which data is required for other plugins)
   */
  order: number;
  /**
   * A middleware to be called, it's required to return @type {NextResponse} for other middlewares
   */
  exec(req: NextRequest, res?: NextResponse, ev?: NextFetchEvent): Promise<NextResponse>;
}

interface SitemapUrl {
  url: string;
  lastmod: string;
}

interface PathParams {
  params: {
    path: string[];
  };
}
interface SitemapJson {
  urlset: {
    url: Array<{
      loc: string;
      lastmod?: string;
    }>;
  };
}
export const extractLocaleFromUrl = (urlString: string) => {
  const url = new URL(urlString);

  // Extract language code from subdomain or domain
  // const subdomainMatch = url.hostname.match(/^(.*?)\./);
  // const subdomain = subdomainMatch ? subdomainMatch[1] : '';

  // Extract language code from path
  const pathParts = url.pathname.split('/');
  const pathLocale = pathParts[1];

  // Prioritize subdomain, then path
  const locale = pathLocale?.toLowerCase() || '';
  // Validate and normalize the locale format (assuming "en" or "en-us")
  return /^([a-z]{2}(-[a-z]{2})?)?$/.test(locale) ? locale : undefined;
};
const replaceBlogUrls = (html: string, oldUrls: string[], newUrl: string) => {
  let modifiedHtml = html;
  oldUrls.map((oldUrl: string) => {
    const regex = new RegExp(`<a href="${oldUrl}`, 'g');
    modifiedHtml = modifiedHtml.replace(regex, `<a href="${newUrl}`);
  });
  return modifiedHtml;
};

export async function fetchSitemapsForPaths(
  sitemapUrls: SitemapUrl[],
  startingPath?: string
): Promise<PathParams[]> {
  const parser = new XMLParser();
  let allPaths: PathParams[] = [];

  for (const { url } of sitemapUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const data = await response.text();
      const jsonData: SitemapJson = parser.parse(data); // Parse XML into JavaScript object

      // Extract paths from the sitemap
      const paths: PathParams[] = jsonData.urlset.url.reduce((acc: PathParams[], entry) => {
        const pathSegments = new URL(entry.loc).pathname.split('/').filter(Boolean);

        // Check if the path matches the startingPath (if provided)
        const isPathIncluded = startingPath ? pathSegments[0] === startingPath : true;

        if (pathSegments.length > 0 && isPathIncluded) {
          return [
            ...acc,
            {
              params: {
                path: pathSegments,
              },
              lastmod: entry.lastmod, // Include lastmod if present
            },
          ];
        }
        return acc;
      }, []);

      allPaths = [...allPaths, ...paths];
    } catch (error) {
      console.error(`Error fetching or parsing sitemap: ${url}`);
      console.error(error);
    }
  }

  return allPaths;
}
const headerContentType = (extension: string | undefined) => {
  let contentType;
  switch (extension) {
    case 'html':
      contentType = 'text/html';
      break;
    case 'js':
      contentType = 'application/javascript';
      break;
    case 'css':
      contentType = 'text/css';
      break;
    case 'json':
      contentType = 'application/json';
      break;
    case 'png':
      contentType = 'image/png';
      break;
    case 'jpg':
    case 'jpeg':
      contentType = 'image/jpeg';
      break;
    case 'gif':
      contentType = 'image/gif';
      break;
    case 'woff2':
      contentType = 'font/woff2';
      break;
    default:
      contentType = 'text/html';
  }
  return contentType;
};

const blogSitemapUrls = [
  {
    url: 'https://tileshopblog.wpengine.com/post-sitemap.xml',
    lastmod: '2025-01-10T16:41:02+00:00',
  },
  {
    url: 'https://tileshopblog.wpengine.com/page-sitemap.xml',
    lastmod: '2018-10-12T18:09:19+00:00',
  },
  {
    url: 'https://tileshopblog.wpengine.com/category-sitemap.xml',
    lastmod: '2025-01-10T16:41:02+00:00',
  },
];

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
export default async function middleware(
  req: NextRequest,
  ev: NextFetchEvent
): Promise<NextResponse> {
  const response = NextResponse.next();

  debug.common('next middleware start');
  const url = req.nextUrl.clone();
  url.pathname = url.pathname.replace(/\/+/g, '/');
  // Check if the user visits the /blog/sitemap.xml
  if (url.pathname === '/blog/sitemap.xml') {
    try {
      // Fetch all paths from the sitemaps
      const blogPaths = (await fetchSitemapsForPaths(blogSitemapUrls, '')) || [];
      const updateBlogURL = `${req.nextUrl.origin}/blog/`;
      const blogSitemaps = blogPaths
        .map((path) => {
          return `<url>
        <loc>${escapeXml(`${updateBlogURL}${path.params.path.join('/')}`)}</loc>
      </url>`;
        })
        .join('');
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogSitemaps}
</urlset>`;
      // Here you could either process paths further or return them
      // For simplicity, we'll just return the paths as a JSON response (you can adjust this as per your needs)
      return new NextResponse(sitemapXml, {
        headers: {
          'Content-Type': 'text/xml;charset=utf-8',
        },
      });
    } catch (error) {
      console.error('Error processing sitemaps:', error);
      return new NextResponse('Failed to process sitemaps', { status: 500 });
    }
  }
  // If the URL was modified, redirect to the new URL
  if (url.pathname !== req.nextUrl.pathname || url.href !== req.nextUrl.href) {
    return NextResponse.redirect(url);
  }

  const urlSplit = req.nextUrl.pathname.split('/');
  const extension = req.nextUrl.pathname.split('?')?.[0]?.split('.')?.pop();

  // chatmeter reverse proxy pages
  if (
    // urlSplit[1] === 'store-locator' ||
    urlSplit[1] === 'img' ||
    urlSplit[1] === 'stat' ||
    // urlSplit[1] === 'locations' ||
    urlSplit[1] === 'modules' ||
    urlSplit[1] === 'Assets'
  ) {
    const url = new URL(`${process.env.CHATMETER_URL}${req.nextUrl.pathname}${req.nextUrl.search}`);

    const response = await fetch(url.toString());
    const headerObject = Object.fromEntries(response.headers.entries());

    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        ...headerObject,
        'Content-Type': headerContentType(extension),
      },
    });
  }
  // blog pages to rewrite to tileshop blog

  if (urlSplit[1] === 'blog') {
    const GetBlogURL = req.nextUrl.pathname.replace('/blog', '');
    const url = new URL(`${process.env.BLOG_WP_URL}${GetBlogURL}`);
    const fetchHTML = await (await fetch(url.toString())).text();
    const updateBlogURL = `${req.nextUrl.origin}/blog`;
    const splitDomains = process.env.BLOG_DOMAINS_URL?.split(',') || [];
    const modifiedHtml = replaceBlogUrls(fetchHTML, splitDomains, updateBlogURL);
    const nextURL = req.nextUrl.origin || 'https://www.tileshop.com';
    const env = process.env.NEXT_PUBLIC_ENV;
    const updatedHTML = modifiedHtml
      .replace(
        /<meta property="og:url" content="https:\/\/tileshopblog\.wpengine\.com(\/[^"]*)"/,
        `<meta property="og:url" content="${nextURL}/blog$1"`
      )
      // Replace link rel="canonical" to handle dynamic paths
      .replace(
        /<link rel="canonical" href="https:\/\/tileshopblog\.wpengine\.com(\/[^"]*)"/,
        `<link rel="canonical" href="${nextURL}/blog$1"`
      )
      .replace(
        /<link rel="pingback" href="https:\/\/tileshopblog\.wpengine\.com\/xmlrpc\.php"/,
        `<link rel="pingback" href="${nextURL}/blog/xmlrpc.php"`
      )
      .replace(/<a href="https:\/\/tileshopblog\.wpengine\.com(\/page\/[^"]*)?"/g, (_, p1) => {
        if (p1 && p1.startsWith('/page/')) {
          return `<a href="${nextURL}/blog${p1}"`;
        }
        return `<a href="${nextURL}"`;
      })
      .replace(/<a([^>]+)href="https:\/\/tileshopblog\.wpengine\.com"/g, `<a$1href="${nextURL}"`)
      .replace(/href="https:\/\/tileshopblog\.wpengine\.com\//g, `href="${nextURL}/blog/`)
      .replace(/<meta name=['"]robots['"] [^>]*\/>/i, () => {
        if (env === 'prod') {
          return `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;
        } else {
          return `<meta name="robots" content="noindex, nofollow" />`;
        }
      });
    return new NextResponse(updatedHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  const start = Date.now();

  const finalRes = await (Object.values(plugins) as MiddlewarePlugin[])
    .sort((p1, p2) => p1.order - p2.order)
    .reduce((p, plugin) => p.then((res) => plugin.exec(req, res, ev)), Promise.resolve(response));

  console.log('MIDDLEWARE NEXT URL PATHNAME', req.nextUrl.pathname, 'search', req.nextUrl.search);
  console.log('req.heads>>', req.nextUrl.pathname.includes('/api'));
  if (req.nextUrl.pathname === '/tileshop') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  // If the request is for an XML file, return the response as is
  if (req?.nextUrl?.pathname?.endsWith('.xml') || req?.nextUrl?.pathname?.endsWith('.json')) {
    return finalRes;
  }
  // Exclude .json, .xml, and API requests from being rewritten
  if (
    req.nextUrl.pathname.includes('.json') ||
    req.nextUrl.pathname.includes('.xml') ||
    req.nextUrl.pathname.includes('/api') ||
    req.nextUrl.pathname.includes('/assets') ||
    req.nextUrl.pathname.includes('.map')
  ) {
    return finalRes;
  }
  if (!req.headers.has('x-Routed') && finalRes.status !== 301) {
    const newUrl = `/tileshop${req.nextUrl.pathname}${req.nextUrl.search}`;
    const nextUrl = new URL(newUrl, req.url);

    const _response = NextResponse.rewrite(nextUrl, { request: req });
    _response.headers.set('x-Routed', 'true');
    console.log('MIDDLEWARE REWRITING_TO', newUrl);
    return _response;
  }

  debug.common('next middleware end in %dms', Date.now() - start);

  return finalRes;
}

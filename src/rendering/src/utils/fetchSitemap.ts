import xml2js from 'xml2js';

interface SitemapEntry {
  loc: string[];
}

interface Sitemap {
  urlset: {
    url: SitemapEntry[];
  };
}
type SitemapUrl = {
  url: string;
  lastmod: string;
};

type PathParams = { params: { path: string[] } };
type SitemapJson = {
  urlset: {
    url: Array<{
      loc: [string];
      lastmod?: [string];
    }>;
  };
};

export const removeDomain = (url: string): string => {
  try {
    const urlObj = new URL(url); // Use URL constructor to parse the URL
    return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return ''; // Return empty string if the URL is invalid
  }
};

export const fetchSitemap = async (
  sitemapUrl: string,
  startingPath?: string
): Promise<PathParams[]> => {
  try {
    // Fetch the sitemap.xml file
    const response = await fetch(sitemapUrl);
    const sitemapText = await response.text();

    // Direct XML parsing using DOMParser
    const parser = new xml2js.Parser();
    const sitemap: Sitemap = await parser.parseStringPromise(sitemapText);

    const urls: PathParams[] = sitemap.urlset.url.reduce((acc, entry) => {
      const pathSegments = new URL(entry.loc[0]).pathname.split('/').filter(Boolean);
      const isPathIncluded = startingPath ? pathSegments[0] === startingPath : true;

      if (pathSegments.length > 0 && isPathIncluded) {
        return [
          ...acc,
          {
            params: {
              path: pathSegments,
            },
          },
        ];
      }
      return acc;
    }, []);

    return urls || [];
  } catch (error) {
    console.error('Error fetching or parsing sitemap');
    console.error(error);
    return [];
  }
};

export async function fetchSitemapsForPaths(
  sitemapUrls: SitemapUrl[],
  startingPath?: string
): Promise<PathParams[]> {
  const parser = new xml2js.Parser();
  let allPaths: PathParams[] = [];

  for (const { url } of sitemapUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const data = await response.text();
      const jsonData: SitemapJson = await parser.parseStringPromise(data);

      // Extract paths from the sitemap
      const paths: PathParams[] = jsonData.urlset.url.reduce((acc: PathParams[], entry) => {
        const pathSegments = new URL(entry.loc[0]).pathname.split('/').filter(Boolean);

        // Check if the path matches the startingPath (if provided)
        const isPathIncluded = startingPath ? pathSegments[0] === startingPath : true;

        if (pathSegments.length > 0 && isPathIncluded) {
          return [
            ...acc,
            {
              params: {
                path: pathSegments,
              },
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

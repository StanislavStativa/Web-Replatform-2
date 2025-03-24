import { formatUrl, getEnvParam } from '@/utils/config';
import { SITE_PAGE_PATTERN } from '@/utils/constants';
import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
export const getPublicUrl = () => getEnvParam('NEXT_PUBLIC_URL');

const removeDomainForInternalUrls = (url?: string) =>
  formatUrl(url?.replace(getEnvParam('NEXT_PUBLIC_URL'), '/'));

export const formatPageUrl = (url?: string, enableDomain?: boolean) => {
  const match = url?.match(SITE_PAGE_PATTERN);

  if (match) {
    const cleanUrl = `${match[1] ? match[1] : ''}${
      match[6] ? match[6].toLowerCase() : ''
    }/${match[8].toLowerCase()}/${match[10].toLowerCase()}`;
    return enableDomain ? cleanUrl : removeDomainForInternalUrls(cleanUrl);
  }

  // Return the original URL in lowercase if no match is found
  return enableDomain ? url : removeDomainForInternalUrls(url);
};

type KeyOrder = 'page' | 'keyword' | 'type' | 'pageType';

export const reorderQueryParams = (queryString?: string) => {
  if (queryString && queryString !== '' && typeof queryString === 'string') {
    const query = queryString.split('#');
    // Required order of keys
    const keyOrder: KeyOrder[] = ['page', 'keyword', 'type', 'pageType'];

    const params = new URLSearchParams(query[0]);
    params.delete('path');

    // Get all keys and sort them based on the keyOrder
    const keys = Array.from(params.keys())?.filter((item) => item !== 'undefined');

    // Create a new URLSearchParams with sorted keys
    const sortedParams = new URLSearchParams();

    // Use a Set to keep track of processed keys and avoid duplicates
    const processedKeys = new Set<string>();

    // Append keys in the specified order
    keyOrder.forEach((key) => {
      if (keys.includes(key) && !processedKeys.has(key)) {
        const values = params.getAll(key) || [];
        values.forEach((value) => sortedParams.append(key, value));
        processedKeys.add(key);
      }
    });

    // Append the remaining keys not in the keyOrder
    keys.forEach((key) => {
      if (!keyOrder.includes(key as KeyOrder) && !processedKeys.has(key)) {
        const values = params.getAll(key) || [];
        values.forEach((value) => sortedParams.append(key, value));
        processedKeys.add(key);
      }
    });
    return `${sortedParams?.toString()}${!!query[1]?.length ? `#${query[1]}` : ''}`;
  }

  return undefined;
};

export const cleanUrlQueryParams = (url: string): string => {
  const _url = new URL(url);
  const sortedParams = reorderQueryParams(_url.search);

  // Return the string with ordered query params
  return `${_url.origin}${_url.pathname}${!!sortedParams?.length ? `?${sortedParams}` : ''}`;
};

export const extractLocaleFromUrl = (urlString: string) => {
  const url = new URL(urlString);

  // Extract language code from subdomain or domain
  const subdomainMatch = url.hostname.match(/^(.*?)\./);
  const subdomain = subdomainMatch ? subdomainMatch[1] : '';

  // Extract language code from path
  const pathParts = url.pathname.split('/');
  const pathLocale = pathParts[1];

  // Prioritize subdomain, then path
  const locale = subdomain || pathLocale || '';

  // Validate and normalize the locale format (assuming "en" or "en-us")
  return /^([a-z]{2}(-[a-z]{2})?)?$/.test(locale) ? locale : undefined;
};

export const sanitizeHtml = (htmlContent: string): string => {
  return htmlContent.replace(
    /<a[^>]*?href=["'](\/|~\/)([^"'\s]+)["'][^>]*>/g,
    '<a target="_blank" href="' + process.env.NEXT_PUBLIC_URL + '$2">'
  );
};

export function removeTrailingSlash(url?: string) {
  return url?.endsWith('/') ? url.slice(0, -1) : url;
}

export const localeToUpper = (locale: string) => {
  const localeParts = locale.split('-');
  if (localeParts.length > 1) {
    return `${localeParts[0]}-${localeParts[1].toUpperCase()}`;
  }
  return locale;
};
export const getValuesFromQueryString = (key: string, homeUrl?: LinkField) => {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key) || (homeUrl ? homeUrl : '/');
  }
  return homeUrl ? homeUrl : '/';
};

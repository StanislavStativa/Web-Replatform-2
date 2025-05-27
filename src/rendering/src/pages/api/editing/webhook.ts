// import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import axios from 'axios';

import { GetItemUrl } from 'lib/webhook/revalidate/graphql';
import {
  SitecoreItemUrl,
  TGetItemUrlRoot,
  TUrl,
  WebhookRequestBody,
} from 'lib/webhook/revalidate/type';
import jssConfig from 'temp/config';
import type { NextApiRequest, NextApiResponse } from 'next';

// export function fetchItemUrlQuery(id: string, lang: string): Promise<TGetItemUrlRoot> {
//   /* This uses Sitecore GraphQLClient wich has built-in debug logging */
//   const queryClient = new GraphQLRequestClient(jssConfig.graphQLEndpoint, {
//     apiKey: jssConfig.sitecoreApiKey,
//   });

//   return queryClient.request<TGetItemUrlRoot>(GetItemUrl, {
//     id: id,
//     lang: lang,
//   });
// }

async function fetchItemUrl(itemId: string, lang: string): Promise<TUrl> {
  const data = (await fetch(process.env.NEXT_PUBLIC_GRAPH_QL_ENDPOINT_MASTER || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      sc_apikey: process.env.NEXT_PUBLIC_SITECORE_API_KEY_MASTER || '',
    },
    body: JSON.stringify({ query: GetItemUrl, variables: { id: itemId, lang } }),
  })
    .then((res) => res.json())
    .then((res) => res.data)) as TGetItemUrlRoot;

  if (data?.item?.url) {
    const path = await getIsrUrl(data.item.url.path); // Await the promise here
    return { ...data.item.url, path };
  }

  return {} as TUrl;
}

async function getIsrUrl(url: string): Promise<string> {
  console.log('ISRURL>>', url);
  // Split the path into segments
  const segments = url?.split('/') || [];
  console.log('Segment ISRURL>>', segments);
  // Check if first segment is a locale (with or without region code)
  if (segments[1] && /^([a-z]{2}(-[a-z]{2})?)?$/.test(segments[1])) {
    segments.splice(2, 0, `_site_${jssConfig.sitecoreSiteName}`);

    console.log('Segment Join ISRURL>>', segments);
    // Join segments back together
    const formattedUrl = segments.join('/');
    console.log('formattedUrl ISRURL>>', formattedUrl);

    // Check if the URL contains 'Products' and format it accordingly
    if (formattedUrl?.includes('/Products/')) {
      try {
        const match = formattedUrl.match(/\/Products\/(?:\d+\/)*(\d+)$/);
        const productSku = match?.[1]?.replace(/SS/g, '') ?? null;

        if (productSku) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL}/api/Product/GetProductItemDetails?productName=${productSku}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const data = await response.json();
          const productUrl = `/products/${data?.UrlSlug}`;
          console.log('POST API call response:', productUrl);
          console.log('Formatted Product SKU:', productSku);

          // You may want to return or use productUrl outside this block
          return productUrl;
        } else {
          console.warn('Product SKU not found in URL.');
        }
      } catch (error) {
        console.error('Error during POST API call:', error);
      }
    }
    return formattedUrl;
  }
  console.log('normalUrl>>', url);
  return `_site_${jssConfig.sitecoreSiteName}${url}`;
}
/**
 * Handles the webhook request.
 * @param req - The NextApiRequest object.
 * @param res - The NextApiResponse object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Check if the onUpdate webhook is enabled
      if (process.env.NEXT_PUBLIC_PUBLISHING_WEBHOOK_ENABLED === 'false') {
        res.status(200).end('ONUPDHOOK is disabled');
        return;
      }
      const { updates } = req.body as WebhookRequestBody;

      // Filter out the LayoutData updates (Items that has layout), and get the item URL for each item page
      const layoutDataUpdates: SitecoreItemUrl[] = updates
        .filter((update) => update.entity_definition === 'Item')
        .map(({ identifier, entity_culture }) => ({ identifier, entity_culture }));

      console.log('ONUPDHOOK LayoutData updates', layoutDataUpdates);

      const urls: TUrl[] = await Promise.all(
        layoutDataUpdates.map(async ({ identifier, entity_culture }): Promise<TUrl> => {
          return fetchItemUrl(identifier.replace('-layout', ''), entity_culture);
        })
      );
      console.log('ONUPDHOOK URLs that needs to be revalidated', urls);
      // for each Url for a page which it's Layout been updated on edge, Revalidate the URLs in Vercel cache

      const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };

      const revalidationUrls = urls.map((url) => url.path).filter((url) => url !== '');

      const revalidateResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/editing/revalidate`,
        {
          secret: process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
          url: revalidationUrls,
        },
        {
          headers,
          timeout: process.env.NEXT_PUBLIC_WEBHOOK_TIMEOUT
            ? parseInt(process.env.NEXT_PUBLIC_WEBHOOK_TIMEOUT)
            : 800000,
          validateStatus: (status) => status < 500,
        }
      );

      const response = {
        message: `ONUPDHOOK revalidated all these ${urls.length} URLs`,
        urls: revalidationUrls,
        info: revalidateResponse.data,
      };
      console.log('ONUPDHOOK Response', JSON.stringify(response));
      res.status(200).json(response);
    } catch (error) {
      console.error('ONUPDHOOK catch' + error);
      //we need to respond with 200 to avoid retries from webhook invocation
      res
        .status(200)
        .json({ message: 'Webhook processing failed', reasons: JSON.stringify(error, null, 2) });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

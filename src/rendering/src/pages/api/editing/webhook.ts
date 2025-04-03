import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { GetItemUrl } from 'lib/webhook/revalidate/graphql';
import {
  SitecoreItemUrl,
  TGetItemUrlRoot,
  TUrl,
  WebhookRequestBody,
} from 'lib/webhook/revalidate/type';
import jssConfig from 'temp/config';
import type { NextApiRequest, NextApiResponse } from 'next';

export function fetchItemUrlQuery(id: string, lang: string): Promise<TGetItemUrlRoot> {
  /* This uses Sitecore GraphQLClient wich has built-in debug logging */
  const queryClient = new GraphQLRequestClient(jssConfig.graphQLEndpoint, {
    apiKey: jssConfig.sitecoreApiKey,
  });

  return queryClient.request<TGetItemUrlRoot>(GetItemUrl, {
    id: id,
    lang: lang,
  });
}

export async function fetchItemUrl(itemId: string, lang: string): Promise<TUrl> {
  const data = await fetchItemUrlQuery(itemId, lang);

  if (data?.item?.url) {
    return data?.item?.url;
  }
  return {} as TUrl;
}

async function getIsrUrl(url: string): Promise<string> {
  console.log('normalUrl>>', url);
  // Split the path into segments
  // const segments = url?.split('/') || [];

  // // Check if first segment is a locale (with or without region code)
  // if (segments[1] && /^([a-z]{2}(-[a-z]{2})?)?$/.test(segments[1])) {
  //   // Insert 'gwlg' after the locale segment
  //   segments.splice(2, 0, 'gwlg');
  //   // Join segments back together
  //   return segments.join('/');
  // }

  if (url?.includes('Products')) {
    let formattedUrl = url;
    const getProductSku = url.match(/\/Products\/(?:\d+\/)*(\d+)$/)?.[1] ?? url;

    await fetch(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL}/api/Product/GetProductItemDetails?productName=${getProductSku?.replace(/SS/g, '')}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('POST API call response:', `/Product/${data?.UrlSlug}`);
        formattedUrl = `/products/${data?.UrlSlug}`;
      })
      .catch((error) => {
        console.error('Error during POST API call:', error);
        return url;
      });
    return formattedUrl;
  } else {
    return `/tileshop${url}`?.toLocaleLowerCase();
  }
}

/**
 * Handles the webhook request.
 * @param req - The NextApiRequest object.
 * @param res - The NextApiResponse object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('req>>>', req.method);
  if (req.method === 'POST') {
    try {
      // Check if the onUpdate webhook is enabled
      // if (process.env.NEXT_PUBLIC_PUBLISHING_WEBHOOK_ENABLED === 'false') {
      //   res.status(200).end('ONUPDHOOK is disabled');
      //   return;
      // }
      const { updates } = req.body as WebhookRequestBody;

      // Filter out the LayoutData updates (Items that has layout), and get the item URL for each item page
      const layoutDataUpdates: SitecoreItemUrl[] = updates
        .filter((update) => update.entity_definition === 'Item')
        .map(({ identifier, entity_culture }) => ({ identifier, entity_culture }));

      console.log('ONUPDHOOK LayoutData updates', layoutDataUpdates);

      const urls: TUrl[] = await Promise.all(
        layoutDataUpdates.map(async ({ identifier, entity_culture }): Promise<TUrl> => {
          return fetchItemUrl(identifier, entity_culture);
        })
      );
      console.log('ONUPDHOOK URLs that needs to be revalidated', urls);
      // for each Url for a page which it's Layout been updated on edge, Revalidate the URLs in Vercel cache

      let headers: { [key: string]: string } = { 'Content-Type': 'application/json' };

      headers = {
        'Content-Type': 'application/json',
      };
      //Here we are looping through the URLs and revalidating them on Vercel by calling a different API /api/admin/revalidate for every url
      //We might need to use a Message Queue to handle this in case of a large number of URLs, as Sitecore Edge
      //has limitation of how many request per seconds we can request, as each revalidate request to Vercel will
      //results in multiple requests to Sitecore Edge to reconstruct the page we are revalidating
      const revalidationResult = await Promise.all(
        urls.map(async (str) => {
          console.log(
            'ONUPDHOOK processing is enabled',
            str?.path !== undefined && str?.path !== '',
            'str: ',
            str
          );

          if (str?.path !== undefined && str?.path !== '') {
            const hostname = process.env.NEXT_PUBLIC_URL
              ? process.env.NEXT_PUBLIC_URL
              : str?.scheme + '://' + str?.hostName + '/';
            console.log('ONUPDHOOK hostname', hostname);

            if (hostname.includes('sitecorecloud.io')) {
              // Skip revalidating the URL if Url includes sitecorecloud.io as it means the site definition hostname is not set up yet
              console.log(
                'ONUPDHOOK: Skipping revalidating the following URL: ' +
                  hostname +
                  str?.path?.startsWith('/')
                  ? str?.path?.substring(1)
                  : str?.path
              );
              return {
                status: 'skipped',
                revalidatePath: str?.path?.startsWith('/') ? str?.path?.substring(1) : str?.path,
                message: 'Skipped revalidating the URL as it includes sitecorecloud.io',
              };
            } else {
              const revalidatePath = await getIsrUrl(str?.path);
              console.log('revalidatePath>>>', revalidatePath);
              try {
                console.log(
                  'ONUPDHOOK revalidate endpoint',
                  JSON.stringify({
                    endpoint: hostname + 'api/editing/revalidate',
                    headers: headers,
                    body: JSON.stringify({
                      secret: process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
                      url: revalidatePath,
                    }),
                  })
                );
                console.log('ONUPDHOOK Revalidating the following URL', revalidatePath);
                const response = await fetch(hostname + 'api/editing/revalidate', {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify({
                    secret: process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
                    url: revalidatePath,
                  }),
                });
                console.log(
                  'ONUPDHOOK Revalidate response',
                  response?.status,
                  response?.statusText
                );
                return {
                  revalidatePath,
                  status: 'done',
                  message: 'Success',
                };
              } catch (error) {
                console.error('ONUPDHOOK Error revalidating the URL', error);
                return {
                  revalidatePath,
                  status: 'failed',
                  message: JSON.stringify(error, null, 2),
                };
              }
            }
          }

          return {
            revalidatePath: '',
            status: 'skipped',
            message: 'Path is empty string or undefined',
          };
        })
      );

      const stats = revalidationResult.reduce(
        (acc, curr) => {
          acc.total++;
          acc[curr.status as 'done' | 'skipped' | 'failed']++;

          if (curr.status !== 'done') {
            acc.reasons.push(`${curr.revalidatePath} ${curr.status} because of ${curr.message}`);
          }

          return acc;
        },
        {
          total: 0,
          done: 0,
          skipped: 0,
          failed: 0,
          reasons: [] as string[],
        }
      );

      res.status(200).json({
        total: stats.total,
        successful: stats.done,
        skipped: stats.skipped,
        failed: stats.failed,
        reasons: stats.reasons.join(';\n '),
        message: 'Webhook processing completed',
      });
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

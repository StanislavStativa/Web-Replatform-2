import type { NextApiRequest, NextApiResponse } from 'next';

export default handler;
export interface RevalidateRequest {
  url?: string[];
  secret?: string;
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const revalidateRequest = req.body as RevalidateRequest;

  if (revalidateRequest.secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return res.status(401).json({ revalidated: false, error: 'Invalid secret' });
  }

  if (!revalidateRequest?.url?.length) {
    return res.status(400).json({ revalidated: false, error: 'No URL provided' });
  }

  try {
    const succededUrls = [];
    const failedUrls = [];
    const skippedUrls = [];

    // Process URLs sequentially instead of in parallel to avoid potential race conditions
    for (const url of revalidateRequest.url) {
      let retries = 3;
      let success = false;
      let lastError: Error | null = null;

      if (!url) {
        skippedUrls.push({
          url: url,
          error: 'No URL provided',
        });
        continue;
      }

      // Normalize the path to ensure consistent handling
      const normalizedUrl = url?.startsWith('/') ? url : `/${url}`;

      console.log(`Attempting to revalidate: ${normalizedUrl}`);

      while (retries > 0 && !success) {
        try {
          // Add a small delay between retries to prevent overwhelming the system
          if (retries < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          await res.revalidate(normalizedUrl);
          success = true;
          succededUrls.push(normalizedUrl);
          console.log(`Successfully revalidated: ${normalizedUrl}`);
        } catch (error: unknown) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.error(`Revalidation attempt failed for ${normalizedUrl}: ${lastError.message}`);
          retries--;
        }
      }

      if (!success) {
        failedUrls.push({
          url: normalizedUrl,
          error: lastError?.message || 'Unknown error',
        });
      }
    }

    return res.status(200).json({
      revalidated: failedUrls.length === 0,
      successRatio: `${(succededUrls.length / revalidateRequest.url.length) * 100}%`,
      items: revalidateRequest.url.length,
      succededUrls,
      failedUrls,
      skippedUrls,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.log(JSON.stringify(req.body, null, 2));
    console.error('Revalidation process failed:', err);
    return res.status(500).json({
      revalidated: false,
      error: err.message || 'Revalidation failed',
    });
  }
}

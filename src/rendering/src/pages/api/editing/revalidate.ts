import type { NextApiRequest, NextApiResponse } from 'next';

export default handler;
export interface RevalidateRequest {
  url?: string;
  secret?: string;
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const revalidateRequest = req.body as RevalidateRequest;
  let revalidated = false;
  console.info('REVHANDL Request body', revalidateRequest);

  if (revalidateRequest.secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    console.info('REVHANDL Failed to revalidate, secret does not match!');
    res.end('Revalidated: ' + revalidated);
  }

  try {
    let pathToClear = '/';
    if (revalidateRequest) {
      pathToClear = revalidateRequest?.url || '';
      console.info('REVHANDL pathToClear set to', pathToClear);
    }
    if (pathToClear === '') {
      console.info('REVHANDL pathToClear is empty!');
      res.end('Revalidated: ' + revalidated);
    }
    console.info('REVHANDL revalidating url', pathToClear);
    await res.revalidate(pathToClear);
    revalidated = true;
  } catch (err) {
    console.info('REVHANDL Error on revalidateRequest', err);
  }
  res.end('Revalidated: ' + revalidated);
}

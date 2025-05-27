import { NextRequest, NextResponse } from 'next/server';
import { PersonalizeMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';
import { MiddlewarePlugin } from '..';
import clientFactory from 'lib/graphql-client-factory';
import config from 'temp/config';
import { siteResolver } from 'lib/site-resolver';

/**
 * This is the personalize middleware plugin for Next.js.
 * It is used to enable Sitecore personalization of pages in Next.js.
 *
 * The `PersonalizeMiddleware` will:
 *  1. Make a call to the Sitecore Experience Edge to get the personalization information about the page.
 *  2. Based on the response, make a call to the Sitecore CDP (with request/user context) to determine the page variant.
 *  3. Rewrite the response to the specific page variant.
 */
class PersonalizePlugin implements MiddlewarePlugin {
  private personalizeMiddleware: PersonalizeMiddleware;

  // Using 1 to leave room for things like redirects to occur first
  order = 1;

  constructor() {
    this.personalizeMiddleware = new PersonalizeMiddleware({
      // Configuration for your Sitecore Experience Edge endpoint
      edgeConfig: {
        clientFactory,
        timeout:
          (process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT &&
            parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT)) ||
          400,
      },
      // Configuration for your Sitecore CDP endpoint
      cdpConfig: {
        sitecoreEdgeUrl: config.sitecoreEdgeUrl,
        sitecoreEdgeContextId: config.sitecoreEdgeContextId,
        timeout:
          (process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT &&
            parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT)) ||
          400,
      },
      // This function determines if the middleware should be turned off.
      disabled: () => process.env.NODE_ENV === 'development',
      // This function determines if a route should be excluded from personalization.
      excludeRoute: () => false,
      // Site resolver implementation
      siteResolver,
      // Moved scope here per Sitecore JSS 22.1 requirements
      scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
    });
  }

  async exec(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    return this.personalizeMiddleware.getHandler()(req, res);
  }
}

export const personalizePlugin = new PersonalizePlugin();

import { SitecorePageProps } from 'lib/page-props';
import config from 'temp/config';
import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import { LayoutServicePageState } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * The Bootstrap component is the entry point for performing any initialization logic
 * that needs to happen early in the application's lifecycle.
 */
const Bootstrap = (props: SitecorePageProps): JSX.Element | null => {
  /**
   * Initializes the application Context and associated Software Development Kits (SDKs).
   * This function is the entry point for setting up the application's context and any SDKs that are required for its proper functioning.
   * It prepares the resources needed to interact with various services and features within the application.
   */
  useEffect(() => {
    const pageState = props.layoutData?.sitecore?.context.pageState;

    if (process.env.NODE_ENV === 'development') {
      console.debug('Browser Events SDK is not initialized in development environments');
    } else if (pageState !== LayoutServicePageState.Normal) {
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
    } else {
      CloudSDK({
        sitecoreEdgeUrl: config.sitecoreEdgeUrl,
        sitecoreEdgeContextId: config.sitecoreEdgeContextId,
        siteName: props.site?.name || config.sitecoreSiteName,
        enableBrowserCookie: true,
        // Replace with the top level cookie domain of the website being integrated, e.g. ".example.com" and not "www.example.com"
        cookieDomain: window.location.hostname.replace(/^www\./, ''),
      })
        .addEvents()
        .initialize();
    }
  }, [props.site?.name]);

  return null;
};

export default Bootstrap;

/**
 * This Layout is needed for Starter Kit.
 */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Placeholder, Field, HTMLLink } from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import Scripts from 'src/Scripts';
import { useRouter } from 'next/router';
import { type LayoutServiceProps } from 'src/global';
import { useQuery } from '@tanstack/react-query';
import { GenericService } from './api';
import { triggerEvent } from './utils/eventTracking';
import Cookies from 'js-cookie';
import { CUST_NUM, USR_EMAIL } from '@/config';
// import EmarsysTracking from './core/molecules/EmersaysTracking/EmersaysTracking';
import dynamic from 'next/dynamic';
import useLocalStorage from './utils/useLocalStorage';
import { transformItems } from './core/molecules/EmersaysTracking/EmersaysTracking';
import { useAtom } from 'jotai';
import { CartItemDetails } from './core/cartStore/CartStoreType';
import { cartDetailAtom } from './core/cartStore/cartState';
import { EXCLUDED_TEMPLATES } from './utils/constants';
// import { ROUTES } from './utils/routes';
// import { authorizationAtom } from './data/atoms/authorization';
const EmarsysTracking = dynamic(
  () => import('./core/molecules/EmersaysTracking/EmersaysTracking'),
  {
    ssr: false,
    loading: () => <p></p>,
  }
);

// Prefix public assets with a public URL to enable compatibility with Sitecore Experience Editor.
// If you're not supporting the Experience Editor, you can remove this.
const publicUrl = config.publicUrl;

interface LayoutProps {
  layoutData: LayoutServiceProps;
  headLinks: HTMLLink[];
  children?: React.ReactNode;
  ogDescription?: string;
  ogTitle?: string;
  ogCanonical?: string;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  NavigationTitle?: Field;
  MetaDescription?: Field;
  MetaImage?: Field;
  MetaTags?: Field;
  MetaTitle?: Field;
  PageTitle?: Field;
  OGImage?: Field;
  CanonicalUrl?: Field;
  MetaKeywords?: Field;
}
interface ITypesArticleSchema {
  '@context': string;
  '@type': string[];
  headline: string;
  description: string;
  image: {
    '@type': string;
    url: string;
    height: number;
    width: number;
  };
}

const Layout = ({
  layoutData,
  headLinks,
  children,
  ogDescription,
  ogTitle,
  ogCanonical,
}: LayoutProps): JSX.Element => {
  console.log('---------------------------------------', layoutData);
  const { route } = layoutData?.sitecore;
  const fields = route?.fields as RouteFields;
  const router = useRouter();
  //const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const isPageEditing = layoutData?.sitecore?.context?.pageEditing;
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';
  const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  const sitName: string | undefined = process.env.NEXT_PUBLIC_OG_SITE_NAME; //layoutData?.sitecore?.context?.site?.name;
  const { getData } = useLocalStorage();
  const userEmail = getData<string>(USR_EMAIL);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isEventTriggered, setIsEventTriggered] = useState<boolean>(false);
  const isProductPage = layoutData?.sitecore?.context?.productData?.ProductName;

  // Check if isProductPage is a string with more than one character using Boolean
  const isValidProductPage = Boolean(
    isProductPage && typeof isProductPage === 'string' && isProductPage?.length > 1
  );

  const isExcludedPages = Boolean(
    layoutData?.sitecore?.route?.templateId &&
      EXCLUDED_TEMPLATES?.includes(layoutData.sitecore.route.templateId)
  );
  const cartPage = layoutData?.sitecore?.route?.name?.includes('cart');
  const orderConfirm = layoutData?.sitecore?.route?.name?.includes('confirmation');

  const title: string | undefined =
    typeof layoutData?.sitecore?.context?.productData?.PageTitle === 'string'
      ? layoutData?.sitecore?.context?.productData?.PageTitle
      : typeof fields?.PageTitle?.value === 'string'
        ? fields?.PageTitle?.value
        : typeof fields?.MetaTitle?.value === 'string'
          ? fields?.MetaTitle?.value
          : undefined;
  const keyword: string =
    typeof fields?.MetaKeywords?.value === 'string' && fields?.MetaKeywords?.value.trim() !== ''
      ? fields?.MetaKeywords?.value
      : typeof layoutData?.sitecore?.context?.productData?.MetaDescription === 'string' &&
          layoutData?.sitecore?.context?.productData?.MetaDescription.trim() !== ''
        ? layoutData?.sitecore?.context?.productData?.MetaDescription
        : '';
  const MetaDescription: string =
    typeof fields?.MetaDescription?.value === 'string' &&
    fields?.MetaDescription?.value.trim() !== ''
      ? fields?.MetaDescription?.value
      : typeof layoutData?.sitecore?.context?.productData?.MetaDescription === 'string' &&
          layoutData?.sitecore?.context?.productData?.MetaDescription.trim() !== ''
        ? layoutData?.sitecore?.context?.productData?.MetaDescription
        : '';
  const description: string =
    typeof layoutData?.sitecore?.context?.productData?.MetaDescription === 'string' &&
    layoutData?.sitecore?.context?.productData?.MetaDescription.trim() !== ''
      ? layoutData?.sitecore?.context?.productData?.MetaDescription
      : typeof fields?.MetaDescription?.value === 'string'
        ? fields?.MetaDescription?.value
        : '';
  const ogImage: string =
    typeof layoutData?.sitecore?.context?.productData?.ImageLink === 'string'
      ? layoutData?.sitecore?.context?.productData?.ImageLink
      : typeof fields?.OGImage?.value === 'string'
        ? fields?.OGImage?.value
        : typeof fields?.MetaImage?.value === 'string'
          ? fields?.MetaImage?.value
          : '';

  const CanonicalUrl = (() => {
    const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/+$/, '') || '';
    const fullUrl =
      layoutData?.sitecore?.context?.itemPath === '/'
        ? `${baseUrl}`
        : layoutData?.sitecore?.context?.productData?.ProductName
          ? `${baseUrl}/products/${layoutData?.sitecore?.context?.productData?.UrlSlug}`
          : `${baseUrl}${layoutData?.sitecore?.context?.itemPath}`;

    return typeof fields?.CanonicalUrl?.value === 'string' &&
      fields?.CanonicalUrl?.value.trim() !== ''
      ? fields?.CanonicalUrl?.value
      : fullUrl;
  })();
  const { data } = useQuery({
    queryKey: ['productPopUp'],
    queryFn: () => GenericService.genericGetSiteSettings(),
  });

  const headerScript = data?.headerScript?.value || '';
  const scriptBlocks = headerScript.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];

  //Article shcema JSON-LD
  const articleSchema: ITypesArticleSchema = {
    '@context': 'http://schema.org',
    '@type': ['Article'],
    headline: title as string,
    description: description as string,
    image: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${ogImage}?fmt=webp`, // use the imgUrl from articleImage
      height: 313,
      width: 470,
    },
  };

  // JSON-LD schema for SEO
  const jsonLDSchema = {
    '@context': 'http://schema.org/',
    '@type': 'Product',

    name: layoutData?.sitecore?.context?.productData?.ProductName,

    image: layoutData?.sitecore?.context?.productData?.ImageLink,

    description: layoutData?.sitecore?.context?.productData?.ProductDescription,

    sku: layoutData?.sitecore?.context?.productData?.ProductCode,
    url: `${process.env.NEXT_PUBLIC_URL?.replace(/\/+$/, '') || ''}${router.asPath}`,
    brand: {
      '@type': 'Brand',

      name: layoutData?.sitecore?.context?.productData?.Brand,
    },
    offers: {
      '@type': 'Offer',
      availability: layoutData?.sitecore?.context?.productData?.IsOnlinePurchasableRetail
        ? 'http://schema.org/InStock'
        : 'https://schema.org/OutOfStock',

      price: layoutData?.sitecore?.context?.productData?.Price,
      priceCurrency: 'USD',
      url: `${process.env.NEXT_PUBLIC_URL?.replace(/\/+$/, '') || ''}${router.asPath}`,
      hasMerchantReturnPolicy: !layoutData?.sitecore?.context?.IsSpecialOrder
        ? [
            {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 60,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
            },
            {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 60,
              returnMethod: 'https://schema.org/ReturnInStore',
              returnFees: 'https://schema.org/FreeReturn',
            },
          ]
        : [
            {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
            },
          ],
    },
  };
  const customerId = Cookies?.get(CUST_NUM);
  useEffect(() => {
    if (window && window?.eventHashes && window?.eventHashes instanceof Set) {
      window.eventHashes.clear();
    }
    setIsEventTriggered(false);
  }, [router.asPath]);
  useEffect(() => {
    if (
      !isValidProductPage &&
      !isExcludedPages &&
      !cartPage &&
      !orderConfirm &&
      userEmail &&
      userEmail !== '' &&
      cartDetailState &&
      !isEventTriggered
    ) {
      setTimeout(() => {
        window?.ScarabQueue?.push(['setEmail', userEmail]);

        if (cartDetailState) {
          const sampleItems = transformItems(cartDetailState?.Samples?.CartItem);
          const cartItems = transformItems(cartDetailState?.CartItems?.CartItem);
          window?.ScarabQueue.push(['cart', [...sampleItems, ...cartItems]]);
          window?.ScarabQueue.push(['go']);
        }
      }, 1000);
      setIsEventTriggered(true);
    }
  }, [
    orderConfirm,
    cartPage,
    isExcludedPages,
    isValidProductPage,
    cartDetailState,
    router.asPath,
    userEmail,
    isEventTriggered,
  ]);

  // useEffect(() => {
  //   const urlWithoutQuery = new URL(router?.asPath, location.origin).pathname.toLocaleLowerCase();
  //   const registerPaths =
  //     urlWithoutQuery.includes(ROUTES.REGISTERROUTE) ||
  //     urlWithoutQuery.includes(ROUTES.REGISTERCONFIRM) ||
  //     urlWithoutQuery.includes(ROUTES.FORGOTROUTE) ||
  //     urlWithoutQuery.includes(ROUTES.EMAILSEARCH);
  //   if (isAuthenticated && registerPaths) {
  //     router.push(ROUTES.MYACCOUNT);
  //   }
  // }, [isAuthenticated, router]);

  if (customerId) {
    triggerEvent({
      userId: customerId,
    });
  }

  return (
    <>
      <Script
        id="google-tag-manager"
        dangerouslySetInnerHTML={{
          __html: `(async function (window, d, s, l, i) {
              window[l] = window[l] || [];
              window[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js',
              });
              const f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
              j.async = true;
              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f?.parentNode?.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', '${googleTagManagerId}');`,
        }}
      />
      <Script
        id="ScarabQueue"
        dangerouslySetInnerHTML={{
          __html: `var ScarabQueue = ScarabQueue || [];
          var goSent = false;
          (function(id) {
            if (document.getElementById(id)) return;
            var js = document.createElement('script'); js.id = id;
            js.src = '//cdn.scarabresearch.com/js/122A2C0D7B94A2BC/scarab-v2.js';
            var fs = document.getElementsByTagName('script')[0];
            fs.parentNode.insertBefore(js, fs);
          })('scarab-js-api');`,
        }}
      />
      {scriptBlocks.map((scriptBlock: string, index: number) => {
        // Extract the content inside the script tag
        const scriptContentMatch = scriptBlock?.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const scriptContent = scriptContentMatch ? scriptContentMatch[1]?.trim() : '';
        const scriptSrcMatch = scriptBlock.match(/src=["']([^"']+)["']/i);
        const scriptSrc = scriptSrcMatch ? scriptSrcMatch[1] : '';

        if (scriptSrc) {
          // If script tag has src, include it as an external script
          return <Script key={index} src={scriptSrc} />;
        } else if (scriptContent) {
          // If script tag has inline content, include it using dangerouslySetInnerHTML
          return (
            <Script
              key={index}
              id={`dynamic-script-${index}`}
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: scriptContent }}
            />
          );
        }

        return null;
      })}

      <EmarsysTracking />
      {/* added event in scarab queue */}
      <Script
        type="text/javascript"
        src={`${process.env.NEXT_PUBLIC_DISCOVER_HOST}${process.env.NEXT_PUBLIC_DISCOVER_INIT_API}`} //environment variable
        async={true}
        strategy="afterInteractive"
      />
      <Scripts />
      <Script id="pinterest-token" src="https://ct.pinterest.com/static/ct/token_create.js" />
      <Script id="pinterest-pinit" src="https://assets.pinterest.com/js/pinit_main.js" />
      <Head>
        {title && <title>{ogTitle && ogTitle !== '' ? ogTitle : title}</title>}
        {ogTitle && <title>{ogTitle && ogTitle !== '' ? ogTitle : title}</title>}
        <link rel="icon" href={`${publicUrl}tileshop/favicon.icon`} />
        {headLinks?.map((headLink) => (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        ))}
        {/* Preconnect to CDN */}
        <link rel="preconnect" href="https://cdn.scarabresearch.com" />
        <link rel="preconnect" href="https://ct.pinterest.com" />
        <link rel="preconnect" href="https://assets.pinterest.com" />
        {/* Preconnect to Google Tag Manager */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Preconnect to third-party service */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL} />
        <link rel="preconnect" href={process.env.GRAPH_QL_ENDPOINT} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_IMAGE_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_DAM_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_PRODUCT_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_DAM_PDF_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_OLAPIC_SRC} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_OLAPIC_GALLERY_SRC} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_CONTENT_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_DISCOVER_HOST} />
        <link rel="preconnect" href={process.env.OPTIVERSAL_URL} />
        <link rel="preconnect" href={process.env.CHATMETER_URL} />
        <link rel="preconnect" href={process.env.CHATMETER_SITEMAP_URL} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_ORDERCLOUD_API_ENDPOINT} />
        <link rel="preconnect" href={process.env.BLOG_WP_URL} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content={sitName} />
        <meta property="og:title" content={ogTitle && ogTitle !== '' ? ogTitle : title} />
        <meta
          property="og:description"
          content={ogDescription && ogDescription !== '' ? ogDescription : description}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_URL?.replace(/\/$/, '')}${router?.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={ogImage} />
        <meta property="twitter:site" content="@TheTileShop" />
        <link
          rel="canonical"
          href={ogCanonical && ogCanonical !== '' ? ogCanonical : CanonicalUrl}
        />
        {layoutData?.sitecore?.context?.productData?.ProductName && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLDSchema) }}
          />
        )}
        {layoutData?.sitecore?.context?.itemPath &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (layoutData.sitecore.context.itemPath?.includes?.('tile-ideas') ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            layoutData.sitecore.context.itemPath?.includes?.('how-to')) && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
          )}
        {layoutData?.sitecore?.context?.productData?.ImageLink && (
          <link
            rel="preload"
            as="image"
            href={`${layoutData?.sitecore?.context?.productData?.ImageLink}`}
          />
        )}
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/Images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/Images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/Images/favicon-16x16.png" />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/assets/Images/favicon/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/assets/Images/favicon/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/assets/Images/favicon/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/assets/Images/favicon/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="60x60"
          href="/assets/Images/favicon/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/assets/Images/favicon/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="76x76"
          href="/assets/Images/favicon/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/assets/Images/favicon/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-48x48.png"
          sizes="48x48"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-128.png"
          sizes="128x128"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/android-chrome-192x192.png"
          sizes="192x192"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/android-chrome-512x512.png"
          sizes="512x512"
        />
        <link rel="manifest" href="/assets/Images/site.webmanifest.json" />
        <link rel="mask-icon" href="/assets/Images/safari-pinned-tab.svg" color="#950715" />
        <meta name="apple-mobile-web-app-title" content="The Tile Shop" />
        <meta name="application-name" content="The Tile Shop" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/assets/Images/favicon/mstile-144x144.png" />
        <meta
          name="msapplication-square70x70logo"
          content="/assets/Images/favicon/mstile-70x70.png"
        />
        <meta
          name="msapplication-square150x150logo"
          content="/assets/Images/favicon/mstile-150x150.png"
        />
        <meta
          name="msapplication-wide310x150logo"
          content="/assets/Images/favicon/mstile-310x150.png"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/assets/Images/favicon/mstile-310x310.png"
        />
        <meta
          name="description"
          content={ogDescription && ogDescription !== '' ? ogDescription : MetaDescription}
        />
        <meta name="keywords" content={keyword} />
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        <header>
          <div id="header">{route && <Placeholder name="headless-header" rendering={route} />}</div>
        </header>
        <main className="mt-14 md:mt-24 lg:mt-32">
          {children}
          <div id="content">{route && <Placeholder name="headless-main" rendering={route} />}</div>
        </main>
        <footer>
          <div id="footer">{route && <Placeholder name="headless-footer" rendering={route} />}</div>
        </footer>
      </div>
    </>
  );
};

export default Layout;

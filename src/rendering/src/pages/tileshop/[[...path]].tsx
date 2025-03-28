import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
// import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  SitecoreContext,
  ComponentPropsContext,
  StaticPath,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { handleEditorFastRefresh } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { SitecorePageProps } from 'lib/page-props';
import { sitecorePagePropsFactory } from 'lib/page-props-factory';
import { componentBuilder } from 'temp/componentBuilder';
import { sitemapFetcher } from 'lib/sitemap-fetcher';
import { QUERY_CONFIG } from '@/constants/react-query';
// import { useAtom } from 'jotai';
// import { authorizationAtom } from '@/data/atoms/authorization';
// import { anonymousSignIn, refreshAccessToken } from '@/data/order-cloud/auth.service';
// import { ROUTES } from '@/utils/routes';
// import router from 'next/router';

const SitecorePage = ({
  // notFound,
  componentProps,
  layoutData,
  headLinks,
}: SitecorePageProps): JSX.Element => {
  // const [{ isAuthenticated, refreshToken }] = useAtom(authorizationAtom);
  // const isAuthRequired = (
  //   layoutData?.sitecore?.route?.fields?.IsProtectedPage as { value: boolean }
  // )?.value;
  const isEditing = layoutData?.sitecore?.context?.pageEditing;
  // useEffect(() => {
  //   if (
  //     (isAuthRequired && !isAuthenticated && !isEditing) ||
  //     (!isAuthenticated && !isEditing && router?.asPath.includes(ROUTES.MYACCOUNT))
  //   ) {
  //     router.push(`${ROUTES.EMAILSEARCH}?returnurl=${router.asPath}`);
  //   }
  // }, [isAuthenticated, isAuthRequired, router]);

  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);
  // useEffect(() => {
  //   if (!isAuthenticated && refreshToken) {
  //     refreshAccessToken(refreshToken);
  //   } else if (!isAuthenticated) {
  //     anonymousSignIn();
  //   }
  // }, [isAuthenticated, refreshToken]);
  // if (notFound || !layoutData?.sitecore?.route) {
  //   // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
  //   return <NotFound />;
  // }

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({ isEditing })}
        layoutData={layoutData}
      >
        {/*
          Sitecore Pages supports component rendering to avoid refreshing the entire page during component editing.
          If you are using Experience Editor only, this logic can be removed, Layout can be left.
        */}
        <Layout layoutData={layoutData} headLinks={headLinks} />
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const getStaticPaths: GetStaticPaths = async (context) => {
  // Fallback, along with revalidate in getStaticProps (below),
  // enables Incremental Static Regeneration. This allows us to
  // leave certain (or all) paths empty if desired and static pages
  // will be generated on request (development mode in this example).
  // Alternatively, the entire sitemap could be pre-rendered
  // ahead of time (non-development mode in this example).
  // See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration

  let paths: StaticPath[] = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development' && !process.env.DISABLE_SSG_FETCH) {
    try {
      // Note: Next.js runs export in production mode
      paths = await sitemapFetcher.fetch(context);
      // Update paths to include the new directory structure
      // paths = paths.map((path) => ({
      //   params: { path: ['tileshop', ...path.params.path] },
      // }));
    } catch (error) {
      console.log('Error occurred while fetching static paths');
      console.log(error);
    }

    fallback = process.env.EXPORT_MODE ? false : fallback;
  }

  return {
    paths,
    fallback,
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation (or fallback) is enabled and a new request comes in.
export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient(QUERY_CONFIG);
  try {
    const props = await queryClient.fetchQuery({
      queryKey: ['layoutData', ...(context.params?.path || [])],
      queryFn: () => sitecorePagePropsFactory.create(context),
    });
    return {
      props: {
        ...props,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 30 min
      revalidate: 1800, // In seconds

      notFound: props.notFound, // Returns custom 404 page with a status code of 404 when true
    };
  } catch {
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 1800, // In seconds
      notFound: true,
    };
  }
};

export default SitecorePage;

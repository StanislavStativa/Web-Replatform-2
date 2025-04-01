import React from 'react';
import dynamic from 'next/dynamic';
import { getHtmlMarkup, MarkupData } from '@/core/molecules/MarkupGenerator/markup-generator.utils';
import { QUERY_CONFIG } from '@/constants/react-query';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { GetStaticProps } from 'next';
import {
  ComponentParams,
  ComponentPropsContext,
  ComponentRendering,
  SitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentBuilder } from '@/temp/componentBuilder';
import { fetchSitemap } from '@/utils/fetchSitemap';
import Layout from '@/Layout';
const MarkupGenerator = dynamic(() => import('@/core/molecules/MarkupGenerator/MarkupGenerator'));

// Interface to represent the expected props for the SitecorePage component
interface SitecoreProps extends SitecorePageProps {
  componentProps: {
    rendering: ComponentRendering & { params: ComponentParams };
    params: ComponentParams;
  };
}

const LocationPage = ({
  markup,
  layoutData,
  componentProps,
  headLinks,
}: SitecoreProps & { markup: MarkupData }) => {
  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({})}
        layoutData={layoutData}
      >
        <Layout layoutData={layoutData} headLinks={headLinks}>
          <div className="container mx-auto small-bottom-margin">
            <MarkupGenerator markup={markup} />
          </div>
        </Layout>
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient(QUERY_CONFIG);
  const customParams = {
    path: 'base-nav', // Match the structure expected by your route, here as an array of strings
  };

  const loc: string[] = [`${process.env.CHATMETER_URL}/locations`];
  if (Array.isArray(params?.path)) {
    params?.path?.map((item: string) => loc.push(item));
  }
  const locatorData = await queryClient.fetchQuery({
    queryKey: ['storeLocatorData'],
    queryFn: () => getHtmlMarkup(loc.join('/')),
  });

  const sitecoreData = await queryClient.fetchQuery({
    queryKey: ['layoutData', 'base-nav'],
    queryFn: async () => {
      try {
        return await sitecorePagePropsFactory.create({ params: customParams });
      } catch (error) {
        console.error('GraphQL Error:', error);
        return null; // Or handle fallback data
      }
    },
  });

  return {
    props: {
      ...sitecoreData,
      layoutData: {
        ...sitecoreData?.layoutData,
        sitecore: {
          ...sitecoreData?.layoutData?.sitecore,
          route: {
            ...sitecoreData?.layoutData?.sitecore?.route,
            fields: {
              ...sitecoreData?.layoutData?.sitecore?.route?.fields,
              PageTitle: {
                ...sitecoreData?.layoutData?.sitecore?.route?.fields?.PageTitle,
                value: null,
              },
            },
          },
        },
      },
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      markup: locatorData,
    },
    revalidate: 5, // In seconds
    notFound: sitecoreData?.notFound,
  };
};

export const getStaticPaths = async () => {
  let paths: { params: { path: string[] } }[] = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development' && !process.env.DISABLE_SSG_FETCH) {
    try {
      // Fetch the sitemap, which might return some undefined values
      const fetchedPaths: ({ params: { path: string[] } } | undefined)[] = await fetchSitemap(
        `${process.env.CHATMETER_URL}/stat/assets/sitemap-0.xml`,
        'locations'
      );

      // Filter out undefined values and map to the correct format
      paths = fetchedPaths.filter(
        (path): path is { params: { path: string[] } } => path !== undefined
      );
    } catch (error) {
      console.error('Error occurred while fetching static paths', error);
      paths = []; // Provide fallback paths in case of error
    }

    fallback = process.env.EXPORT_MODE ? false : fallback;
  }

  return {
    paths,
    fallback,
  };
};

export default LocationPage;

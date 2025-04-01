import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  type MarkupData,
  parseHtmlMarkup,
} from '@/core/molecules/MarkupGenerator/markup-generator.utils';
import { QUERY_CONFIG } from '@/constants/react-query';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  ComponentParams,
  ComponentPropsContext,
  ComponentRendering,
  // Placeholder,
  SitecoreContext,
  StaticPath,
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

const ShopPage = ({
  markup,
  layoutData,
  componentProps,
  headLinks,
}: SitecoreProps & { markup: MarkupData }) => {
  const [title, setTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [canonical, setCanonical] = useState<string>('');
  useEffect(() => {
    if (markup?.slBody !== '') {
      const titleMatch = markup?.slBody?.match(/<title>(.*?)<\/title>/);
      if (titleMatch) setTitle(titleMatch?.[1]);

      // Extract meta description
      const descriptionMatch = markup?.slBody?.match(
        /<meta\s+property="og:description"\s+content=['"](.*?)['"]/
      );
      if (descriptionMatch) setMetaDescription(descriptionMatch?.[1]);

      // Extract canonical URL
      const canonicalMatch = markup?.slBody?.match(
        /<link\s+rel=['"]canonical['"]\s+href=['"](.*?)['"]/
      );
      if (canonicalMatch) setCanonical(canonicalMatch?.[1]);
    }
  }, [markup]);
  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({})}
        layoutData={layoutData}
      >
        <Layout
          layoutData={layoutData}
          headLinks={headLinks}
          ogDescription={metaDescription}
          ogTitle={title}
          ogCanonical={canonical}
        >
          <div className="container mx-auto small-bottom-margin">
            <MarkupGenerator markup={markup} parser={false} />
          </div>
        </Layout>
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const getStaticPaths: GetStaticPaths = async () => {
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
      paths = await fetchSitemap(`${process.env.OPTIVERSAL_URL}/shop/sitemap.xml`);
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

/* const getShopData = async (name: string) => {
  const response = await fetch(`${process.env.OPTIVERSAL_URL}/data/${name}.json`);
  const data = await response.json();
  return { slHeader: [], slBody: atob(data.content) };
};
 */
const getShopData = async (name: string) => {
  try {
    const response = await fetch(`${process.env.OPTIVERSAL_URL}/data/${name}.json`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch shop data. Status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data || !data.content) {
      throw new Error('Invalid data structure: Missing content field');
    }

    return {
      slHeader: parseHtmlMarkup(
        `<!DOCTYPE html><html><head><title>${data.title}</title></head><body></body></html>`
      ).slHeader,
      slBody: atob(data.content),
      metadata: { title: data.title },
    };
  } catch (error) {
    console.error('Error fetching shop data:', error);

    return {
      slHeader: [],
      slBody: '',
    };
  }
};
export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient(QUERY_CONFIG);

  const locatorData = await queryClient.fetchQuery({
    queryKey: ['storeLocatorData'],
    queryFn: () => getShopData((context.params?.path as string[])?.[0]),
  });

  const sitecoreData = await queryClient.fetchQuery({
    queryKey: ['layoutData', 'base-nav'],
    queryFn: async () => {
      try {
        return await sitecorePagePropsFactory.create({
          ...context,
          params: {
            path: ['base-nav'],
          },
        });
      } catch (error) {
        console.error('GraphQL Error:', error);
        return null; // Or handle fallback data
      }
    },
  });

  console.log('+45454545+++++++++++++++++++++++++sitecoreData', sitecoreData);

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
    notFound: sitecoreData?.notFound || !locatorData.slBody, // Returns custom 404 page with a status code of 404 when true
  };
};

export default ShopPage;

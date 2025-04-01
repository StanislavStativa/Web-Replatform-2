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
  Placeholder,
  SitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from '@/lib/page-props';
import { componentBuilder } from '@/temp/componentBuilder';

const MarkupGenerator = dynamic(() => import('@/core/molecules/MarkupGenerator/MarkupGenerator'));

// Interface to represent the expected props for the SitecorePage component
interface SitecoreProps extends SitecorePageProps {
  componentProps: {
    rendering: ComponentRendering & { params: ComponentParams };
    params: ComponentParams;
  };
}

const StoreLocatorPage = ({
  markup,
  layoutData,
  componentProps,
}: SitecoreProps & { markup: MarkupData }) => {
  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({})}
        layoutData={layoutData}
      >
        <div>
          <header>
            <div id="header">
              {layoutData?.sitecore?.route && (
                <Placeholder name="headless-header" rendering={layoutData.sitecore.route} />
              )}
            </div>
          </header>
          <main className="mt-14 md:mt-24 lg:mt-32">
            <div className="container mx-auto small-bottom-margin">
              <MarkupGenerator markup={markup} cssIgnore={['css.css']} />
            </div>
          </main>
          <footer>
            {layoutData?.sitecore?.route && (
              <Placeholder name="headless-footer" rendering={layoutData.sitecore.route} />
            )}
          </footer>
        </div>
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient(QUERY_CONFIG);

  const locatorData = await queryClient.fetchQuery({
    queryKey: ['storeLocatorData'],
    queryFn: () => getHtmlMarkup(`${process.env.CHATMETER_URL}/store-locator`),
  });

  const sitecoreData = await queryClient.fetchQuery({
    queryKey: ['layoutData', 'base-nav'],
    queryFn: async () => {
      try {
        return await sitecorePagePropsFactory.create(context);
      } catch (error) {
        console.error('GraphQL Error:', error);
        return null; // Or handle fallback data
      }
    },
  });

  console.log(
    '!!!!!!!!!!!++++++++++++++++++++++++++++++!!!!!!!!!!!!!!!))sitecoreData',
    sitecoreData
  );

  return {
    props: {
      ...sitecoreData,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      markup: locatorData,
    },
    revalidate: 5, // In seconds
    notFound: sitecoreData?.notFound,
  };
};

export default StoreLocatorPage;

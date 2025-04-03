import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  RenderingType,
  SitecoreContext,
  ComponentPropsContext,
  EditingComponentPlaceholder,
  StaticPath,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { handleEditorFastRefresh } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { SitecorePageProps } from 'lib/page-props';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { sitecorePagePropsFactory } from 'lib/page-props-factory';
import { componentBuilder } from 'temp/componentBuilder';
import { QUERY_CONFIG } from '@/constants/react-query';
import { GenericService, ProductService } from '@/api';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useAtom } from 'jotai';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';

const SitecorePage = ({
  notFound,
  componentProps,
  layoutData,
  headLinks,
}: SitecorePageProps): JSX.Element => {
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  useEffect(() => {
    handleEditorFastRefresh();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      anonymousSignIn();
    }
  }, [isAuthenticated]);
  if (notFound || !layoutData?.sitecore?.route) {
    return <NotFound />;
  }

  const isEditing = layoutData.sitecore.context.pageEditing;
  const isComponentRendering =
    layoutData.sitecore.context.renderingType === RenderingType.Component;

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({ isEditing })}
        layoutData={layoutData}
      >
        {isComponentRendering ? (
          <EditingComponentPlaceholder rendering={layoutData.sitecore.route} />
        ) : (
          <Layout layoutData={layoutData} headLinks={headLinks} />
        )}
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: StaticPath[] = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development' && !process.env.DISABLE_SSG_FETCH) {
    try {
      // Note: Next.js runs export in production mode
      console.log('paths', JSON.stringify(paths));
    } catch (error) {
      console.log('Error occurred while fetching static paths');
      console.log('ERR', error);
    }

    fallback = process.env.EXPORT_MODE ? false : fallback;
  }

  return {
    paths,
    fallback,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient(QUERY_CONFIG);

  if (context.params) {
    context.params.requestPath = context.params.path;
    context.params.path = [`products/,-w-,`];
  }

  const path = context?.params?.requestPath;
  const productsPath = typeof path === 'string' ? path : path?.pop() ?? '';
  let props = {} as SitecorePageProps;
  let productData;

  try {
    // New API call to fetch redirect path
    const redirectPath = await queryClient.fetchQuery({
      queryKey: ['redirectPath', productsPath],
      queryFn: () => {
        return GenericService.genericGetProductRedirect(
          `/products/${productsPath?.replace(/-{2,}/g, '-')}`
        );
      },
    });
    // If the API returns a valid redirect path
    if (redirectPath && redirectPath?.Target) {
      return {
        redirect: {
          destination: redirectPath?.Target,
          permanent: true,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching redirect path:', error);
  }
  try {
    const [_layoutData, _productData] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['layoutData', 'products', productsPath],
        queryFn: () => sitecorePagePropsFactory.create(context),
      }),
      queryClient.fetchQuery({
        queryKey: ['productData', productsPath],
        queryFn: () =>
          ProductService.productGetProductItemDetails(productsPath?.replace(/-{2,}/g, '-')), //replacing extra hypens
      }),
    ]);
    props = _layoutData;
    productData = _productData;
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  if (productData) {
    props.notFound = false;
    props.layoutData.sitecore.context = {
      ...props.layoutData.sitecore.context,
      productData,
    };
  } else {
    props.notFound = true;
  }
  return {
    props: {
      ...props,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 1800, // In seconds
    notFound: props.notFound, // Returns custom 404 page with a status code of 404 when true
  };
};

export default SitecorePage;

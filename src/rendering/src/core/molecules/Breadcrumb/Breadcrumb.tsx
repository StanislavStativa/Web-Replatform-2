import { BreadcrumbItem, type BreadcrumbProps } from '@/core/molecules/Breadcrumb/Breadcrumb.type';
import Link from '@/core/atoms/Link/Link';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/api/services/ProductService';
import useLocalStorage from '@/utils/useLocalStorage';
const Breadcrumb: React.FC<BreadcrumbProps> = ({ rendering }) => {
  const { fields, uid } = rendering;
  const router = useRouter();
  const context = useSitecoreContext();
  const { setData, getData, getSessionData } = useLocalStorage();
  const localBreadCrumbs = getData<BreadcrumbItem[]>('breadcrumbItems');
  const isBreadCrumbsFromApi = getSessionData('isBreadCrumbsFromApi') ?? false;
  const [updatedBreadCrumbs, setUpdatedBreadCrumbs] = useState<BreadcrumbItem[] | []>([]);

  const breadcrumbItems = [...fields?.data?.item?.ancestors]
    .reverse()
    .concat(fields?.data?.item)
    .filter((data) => data?.HideInNavigation?.value !== '1');

  const { data: productBreadcrumbs } = useQuery({
    queryKey: ['productBreadcrumbsDetails', router?.asPath],
    queryFn: () => {
      return ProductService.productGetProductBreadcrum(
        router?.asPath?.match(/(\d+\w*)$/)?.[0] as string
      );
    },
    enabled: Boolean(
      context.sitecoreContext?.productData !== undefined &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        context.sitecoreContext?.productData?.ProductName !== ''
    ),
  });
  useEffect(() => {
    const handleRouteChange = () => {
      if (context.sitecoreContext?.route?.templateId === 'd99a18de-5be0-4989-bf07-295cbf6054a0') {
        setData('breadcrumbItems', breadcrumbItems);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, context.sitecoreContext?.route?.templateId, breadcrumbItems]);
  useEffect(() => {
    if (
      context.sitecoreContext?.productData !== undefined &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context.sitecoreContext?.productData?.ProductName !== '' &&
      productBreadcrumbs?.length > 0
    ) {
      const productFirstData = {
        NavigationTitle: productBreadcrumbs?.[0]?.NavigationTitle,
        name: productBreadcrumbs?.[0]?.Name,
        path: productBreadcrumbs?.[0]?.Path,
      };
      const productLastData = {
        NavigationTitle: '*',
        name: '*',
        path: '*',
      };
      const relevantAncestors = productBreadcrumbs?.[0]?.ancestors
        ?.slice(
          0,
          productBreadcrumbs?.[0]?.ancestors.findIndex(
            (a: { name: string }) => a?.name?.toLowerCase() === 'home'
          ) + 1
        )
        .reverse();

      const concatedApiBreadCrumb = [...relevantAncestors, productFirstData, productLastData];

      const mappedProductsBreadCrumb = concatedApiBreadCrumb?.map((item) => ({
        url: { path: item.path },
        name: item.name,
        NavigationTitle: { value: item.NavigationTitle },
        PageTitle: { value: item.NavigationTitle },
        HideInNavigation: { value: '' },
      })); // api breadcrumb

      const concatedBreadCrumb = localBreadCrumbs?.concat(breadcrumbItems) || [];

      const uniqueBreadCrumb = concatedBreadCrumb?.filter(
        (item: { name: string }, index: number, self: BreadcrumbItem[]) =>
          index === self?.findIndex((t) => t?.name === item?.name)
      ); //Local breadcrumb
      if (uniqueBreadCrumb?.length > 0 && isBreadCrumbsFromApi === false) {
        setUpdatedBreadCrumbs(uniqueBreadCrumb);
      } else {
        setUpdatedBreadCrumbs(mappedProductsBreadCrumb);
      }
    } else {
      setUpdatedBreadCrumbs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    context.sitecoreContext?.productData,
    router?.pathname,
    productBreadcrumbs,
    isBreadCrumbsFromApi,
  ]);
  // Generate the breadcrumb schema
  const breadcrumbSchema = updatedBreadCrumbs.length > 0 ? updatedBreadCrumbs : breadcrumbItems;

  const itemListElement = breadcrumbSchema.map((item, index) => {
    let name = item?.NavigationTitle?.value || item?.PageTitle?.value || item?.name;
    let url = item?.url?.path;

    // Check if this is the last item and if product data is available
    if (
      index === breadcrumbSchema.length - 1 &&
      context.sitecoreContext?.productData !== undefined &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context.sitecoreContext?.productData?.ProductName !== ''
    ) {
      url = router?.asPath;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      name = context.sitecoreContext?.productData?.ProductName;
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': url,
        name: name,
      },
    };
  });

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });

  return (
    <div className="container mx-auto pl-3 pr-5 md:pr-0 md:px-10 lg:py-3 bread-crumb">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
          data-nscript="afterInteractive"
        />
      </Head>
      {updatedBreadCrumbs?.length > 0 ? (
        <nav className=" text-base font-normal flex items-center gap-x-1.5 ">
          {updatedBreadCrumbs?.map((breadcrumbItem, index) => {
            const isLastItem = index === updatedBreadCrumbs?.length - 1;
            const isSecondLastItem = index === updatedBreadCrumbs?.length - 2;
            const title =
              breadcrumbItem?.NavigationTitle?.value ||
              breadcrumbItem?.PageTitle?.value ||
              breadcrumbItem?.name;

            return (
              <div key={`${uid}+${index}`} className="flex  items-center">
                {/* For mobile view, only show the immediate parent (second last item) */}
                {isSecondLastItem && (
                  <div className="lg:hidden text-dark-gray  flex items-center">
                    <MdArrowBackIos size="0.6rem" />
                    <Link
                      field={{ href: breadcrumbItem?.url?.path }}
                      editable={false}
                      className="hover:underline "
                    >
                      {title}
                    </Link>
                  </div>
                )}

                {/* For non-mobile view, render all items */}
                {!isLastItem && (
                  <div className="hidden text-dark-gray lg:flex items-center gap-x-1.5">
                    <Link
                      field={{ href: breadcrumbItem?.url?.path }}
                      editable={false}
                      className="hover:underline "
                    >
                      {title}
                    </Link>
                    <MdArrowForwardIos size="0.6rem" />
                  </div>
                )}

                {/* Always render the last item */}
                {isLastItem && (
                  <span className="hidden lg:inline">
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      context.sitecoreContext?.productData?.ProductName
                    }
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      ) : (
        <nav className=" text-base font-normal flex items-center gap-x-1.5 ">
          {breadcrumbItems?.map((breadcrumbItem, index) => {
            const isLastItem = index === breadcrumbItems?.length - 1;
            const isSecondLastItem = index === breadcrumbItems?.length - 2;
            const title =
              breadcrumbItem?.NavigationTitle?.value ||
              breadcrumbItem?.PageTitle?.value ||
              breadcrumbItem?.name;

            return (
              <div key={`${uid}+${index}`} className="flex  items-center">
                {/* For mobile view, only show the immediate parent (second last item) */}
                {isSecondLastItem && (
                  <div className="lg:hidden text-dark-gray flex items-center pt-2.5 mobile-breadcrumb">
                    <MdArrowBackIos size="0.6rem" />
                    <Link
                      field={{ href: breadcrumbItem?.url?.path }}
                      editable={false}
                      className="hover:underline text-dark-gray"
                    >
                      {title}
                    </Link>
                  </div>
                )}

                {/* For non-mobile view, render all items */}
                {!isLastItem && (
                  <div className="hidden text-dark-gray lg:flex items-center gap-x-1.5">
                    <Link
                      field={{ href: breadcrumbItem?.url?.path }}
                      editable={false}
                      className="hover:underline text-dark-gray"
                    >
                      {title}
                    </Link>
                    <MdArrowForwardIos size="0.6rem" />
                  </div>
                )}

                {/* Always render the last item */}
                {isLastItem && (
                  <span className="hidden lg:inline font-latoBold text-dark-gray">
                    {title === '*' // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      ? // @ts-ignore
                        context.sitecoreContext?.productData?.ProductName
                      : title}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default Breadcrumb;

import Script from 'next/script';
import { type OlapicWidgetProps } from './OlapicWidget.type';
import { useEffect, useState } from 'react';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { useRouter } from 'next/router';
import useLocalStorage from '@/utils/useLocalStorage';
import { cn } from '@/utils/cn';
import { extractProductId } from '@/utils/regex';

const OlapicWidgetVarient = (props: OlapicWidgetProps) => {
  const { fields } = props?.rendering;
  const { DataInstance, OlapicType } = fields;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { getSessionData } = useLocalStorage();
  const asPath = getSessionData('tts_asPath');
  const isProductPage = Boolean(props?.rendering?.params?.IsProductPage);

  useEffect(() => {
    if (asPath && router.asPath !== asPath) {
      window.location.reload();
    } else if (asPath === null || asPath === undefined) return;
  }, [asPath, router.asPath]);

  return (
    <>
      {isLoading && (
        <div className={cn('relative w-full h-40', { 'h-96': isProductPage })}>
          <LoaderSpinner className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50" />
        </div>
      )}
      <div
        id={props?.scriptId}
        className={cn('px-4 ', {
          'pb-10 md:pb-20': !isProductPage,
          'pb-0 md:pb-10': isProductPage,
        })}
      ></div>
      {DataInstance && (
        <Script
          id={props?.scriptId}
          type="text/javascript"
          async={true}
          onLoad={() => {
            setIsLoading(false);
          }}
          charSet="utf-8"
          data-olapic={props?.scriptId}
          data-instance={DataInstance?.value}
          data-apikey={process?.env?.NEXT_PUBLIC_OLAPIC_API_KEY}
          data-tags={isProductPage ? extractProductId(router?.asPath) : undefined}
          src={
            OlapicType?.value === 'Gallery'
              ? process?.env?.NEXT_PUBLIC_OLAPIC_GALLERY_SRC
              : process?.env?.NEXT_PUBLIC_OLAPIC_SRC
          }
        ></Script>
      )}
    </>
  );
};

export default OlapicWidgetVarient;

import PDPInfoMobile from './PDPInfoMobile';
import PDPInfoDesktop from './PDFInfoDesktop'; // Correct the typo from PDFInfoDesktop to PDPInfoDesktop
import { useI18n } from 'next-localization';
import { type PDPInfoProps, type ProductInfo } from './PDPInfo.types';
import { useEffect, useState } from 'react';
import { Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const PDPInfo = (props: PDPInfoProps) => {
  const { t } = useI18n();
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const HeadingTag = props?.params?.HeadingTag;
  const HeadingSize = props?.params?.HeadingSize;
  const context = useSitecoreContext();
  const data = context.sitecoreContext?.productData as ProductInfo;
  const productId = data?.ProductCode;
  const { productAttributesData, isLoading } = useProductAttributes(false, productId);

  useEffect(() => {
    if (data) {
      setProductInfo(data);
    }
  }, [data]);

  const text: TextField = {
    value: t('PDPInfo_ProductInformation'),
  };
  return (
    <>
      {isLoading && <LoaderSpinner />}
      {isLoading ? (
        <div className="h-65 md:h-96 w-full skeleton rounded"></div>
      ) : (
        <>
          {productAttributesData && !productAttributesData?.IsSample && (
            <div
              className={`component-content w-full md:border-t md:border-black/[0.35] items-start flex-col ${props?.params?.styles}`}
            >
              <div className="flex flex-col items-start justify-center">
                <div className="mx-3 my-6 md:my-6 md:mx-10">
                  <Text
                    field={text}
                    tag={HeadingTag || 'h2'}
                    className={cn(
                      'font-semibold text-xl md:text-2xl text-dark-gray md:font-latoRegular md:font-normal',
                      getHeadingStyles(HeadingSize, HeadingTag)
                    )}
                  />
                </div>
                {productInfo && (
                  <>
                    <div className="block md:hidden w-full">
                      <PDPInfoMobile
                        data={productInfo}
                        fields={props?.fields}
                        rendering={props.rendering}
                        params={props.params}
                      />
                    </div>
                    <div className="hidden md:block w-full">
                      <PDPInfoDesktop
                        data={productInfo}
                        fields={props?.fields}
                        rendering={props.rendering}
                        params={props.params}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PDPInfo;

import React, { useState, useEffect } from 'react';
import { type ProductAttributesProps, type ProductProps } from './ProductAttributes.types';
import PDPMainTitle from './PDPMainTitle';
import PDPPriceDetail from './PDPPriceDetail';
import PDPColorAndSize from './PDPColorAndSize';
import { type ProductImageGallery } from '../ProductImageGallery/ProductImageGallery.type';
import PDPCartButton from './PDPCartButton';
import PDPIcon from './PDPIcon';
import PDPCalculator from './PDPCalculator';
import PDPCollections from './PDPCollections';

import { useI18n } from 'next-localization';
import PDPAlertMessage from './PDPAlertMessage';
import PDPFinishVariant from './PDPFinishVariant';
import PDPColor from './PDPColor';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { triggerEvent } from '@/utils/eventTracking';
import { event, USR_EMAIL } from '@/config';
import { useRouter } from 'next/router';
import useLocalStorage from '@/utils/useLocalStorage';
import { useAtom } from 'jotai';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { transformItems } from '../EmersaysTracking/EmersaysTracking';

type PDPEventData = {
  price: number;
  quantity: number;
  index: number;
  currency: string;
  value: number;
  items: {
    item_brand: string;
    item_category: string;
    item_category2: string;
    item_category3: string;
    item_category4?: string;
    item_category5: string;
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
    discount: number;
  }[];
} | null;

export const ProductAttributes: React.FC<ProductAttributesProps> = (props) => {
  const context = useSitecoreContext();
  const router = useRouter();
  const { params, fields, rendering } = props;
  const [productImageGallery, setProductImageGallery] = useState<
    ProductImageGallery | null | undefined
  >(null);
  const { getData } = useLocalStorage();
  const [productAtrributes, setProductproductAtrributes] = useState<ProductProps | null>(null);
  const userEmail = getData<string>(USR_EMAIL);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [totalUnits, setTotalUnits] = useState<number>(1);
  const { t } = useI18n();
  const data = context?.sitecoreContext?.productData as ProductImageGallery;
  const { productAttributesData, isLoading } = useProductAttributes(true, data?.ProductCode);

  const [pdpEventData, setPdpEventData] = useState<PDPEventData>(null);

  useEffect(() => {
    if (data) {
      setProductImageGallery(data);
    } else {
      setProductImageGallery(undefined);
    }
  }, [data]);

  useEffect(() => {
    if (productAttributesData && data) {
      setProductproductAtrributes({
        ...productAttributesData,
        CoveragePerBox: data?.CoveragePerBox, // Update or add CoveragePerBox
        StockType: data?.StockType,
        ImageLink: data?.ImageLink,
        ProductNotAvailableDescText: data?.ProductNotAvailableDescText,
        ProductName: data?.ProductName,
      });
    }
  }, [productAttributesData, data]);

  useEffect(() => {
    if (data && productAttributesData && pdpEventData === null) {
      const priceBreak = productAttributesData?.PriceSchedule?.PriceBreaks?.[0];
      const eventData = {
        price: Number(productAttributesData?.PriceSchedule?.PriceBreaks[0]?.SalePrice?.toFixed(2)),
        quantity: 1,
        index: 0,
        currency: 'USD',
        value: Number(productAttributesData?.PriceSchedule?.PriceBreaks[0]?.SalePrice.toFixed(2)),
        items: [
          {
            quantity: 1,
            discount:
              Number(priceBreak?.Price) === 0
                ? 0
                : Number((Number(priceBreak?.Price) - Number(priceBreak?.SalePrice)).toFixed(2)),
            item_id: data?.ProductCode || '',
            item_name: data?.ProductName || '',
            item_brand: productAttributesData?.Brand || '',
            item_category: productAttributesData?.ProductHierarchy1 || '',
            item_category2: productAttributesData?.ProductHierarchy2 || '',
            item_category3: productAttributesData?.MaterialGroupName || '',
            item_category4: productAttributesData?.CollectionName || '',
            item_category5: '',
            price: Number(priceBreak?.SalePrice?.toFixed(2)),
          },
        ],
      };
      setPdpEventData(eventData);
    }
  }, [router?.asPath, productAttributesData, data]);

  useEffect(() => {
    if (pdpEventData) {
      if (userEmail && userEmail !== '') {
        setTimeout(() => {
          window?.ScarabQueue?.push(['setEmail', userEmail]);
          if (cartDetailState) {
            const sampleItems = transformItems(cartDetailState?.Samples?.CartItem);
            const cartItems = transformItems(cartDetailState?.CartItems?.CartItem);
            window?.ScarabQueue.push(['cart', [...sampleItems, ...cartItems]]);
          } else {
            window?.ScarabQueue.push(['cart', []]);
          }
          window?.ScarabQueue?.push(['view', String(data?.ProductCode)]);
          window?.ScarabQueue.push(['go']);
        }, 1000);
      }
      triggerEvent({
        event: event.VIEW_ITEM,
        ecommerce: {
          currency: 'USD',
          value: pdpEventData?.price,
          items: pdpEventData?.items,
        },
      });
    }
  }, [pdpEventData]);
  useEffect(() => {
    setPdpEventData(null);
  }, [router?.asPath]);

  let colorCode = {
    color: '',
    text: '',
  };
  if (productAtrributes?.IsClearance) {
    colorCode = {
      color: 'bg-badge-red text-white',
      text: t('Tag_Clearance'),
    };
  } else if (productAtrributes?.IsNewArrival) {
    colorCode = {
      color: 'bg-dark-gray text-white',
      text: t('Tag_NewArrival'),
    };
  } else if (productAtrributes?.IsBestSeller) {
    colorCode = {
      color: 'bg-tonal-gray text-dark-gray',
      text: t('Tag_BestSeller'),
    };
  }
  const handleTotalUnitsChange = (units: number) => {
    setTotalUnits(units);
  };
  return (
    <>
      <div className={`component w-full ${params.styles}`}>
        <div className="component-content container mx-auto lg:pl-24">
          <div className="hidden md:block">
            {colorCode.color && (
              <div>
                <span
                  className={`inline-block ${colorCode.color} text-sm font-latoBold uppercase py-1 px-4 rounded-full tracking-custom`}
                >
                  {colorCode.text}
                </span>
              </div>
            )}
            {productImageGallery === null && isLoading ? (
              <div className="h-44 w-full skeleton rounded mt-2"></div>
            ) : (
              <>
                {productImageGallery && productImageGallery !== undefined && (
                  <PDPMainTitle
                    ProductName={data?.ProductName || ''}
                    ProductCode={data?.ProductCode || ''}
                    CoveragePerBox={data?.CoveragePerBox || 0}
                    SellingUOM={data?.SellingUOM || ''}
                  />
                )}
              </>
            )}
          </div>
          {isLoading ? (
            <div className="h-17 w-full skeleton rounded mt-2"></div>
          ) : (
            <>
              {productAtrributes && productAtrributes?.IsSample === false && (
                <PDPPriceDetail
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                />
              )}
            </>
          )}

          {productAtrributes && data?.StockType === 'SPECIAL ORDER' && (
            <PDPAlertMessage
              fields={fields}
              rendering={rendering}
              params={params}
              data={productAtrributes}
            />
          )}

          {productAtrributes && data?.StockType !== 'SPECIAL ORDER' && (
            <PDPAlertMessage
              fields={fields}
              rendering={rendering}
              params={params}
              data={productAtrributes}
            />
          )}
          {isLoading ? (
            <div className="h-24 md:h-28 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && productAtrributes.Finish?.length > 0 && (
                <PDPFinishVariant
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                />
              )}
            </>
          )}

          {isLoading ? (
            <div className="h-24 md:h-28 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && productAtrributes.Colors?.length > 0 && (
                <PDPColor
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                />
              )}
            </>
          )}

          {isLoading ? (
            <div className="h-24 md:h-28 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && productAtrributes.SizeShape?.length > 0 && (
                <PDPColorAndSize
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                />
              )}
            </>
          )}

          {isLoading ? (
            <div className="h-6 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && productAtrributes.IsSample === false && (
                <PDPCalculator
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                  onTotalUnitsChange={handleTotalUnitsChange}
                />
              )}
            </>
          )}

          {isLoading ? (
            <div className="h-11 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && (
                <PDPCartButton
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                  totalUnits={totalUnits}
                  ProductCode={productAtrributes?.SamplePriceSchedule?.xp?.ProductId}
                />
              )}
            </>
          )}

          {isLoading ? (
            <div className="h-5 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && (
                <PDPIcon
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                />
              )}
            </>
          )}

          {isLoading ? (
            <div className="h-65 w-full skeleton rounded mt-5"></div>
          ) : (
            <>
              {productAtrributes && productAtrributes?.Collection?.length > 0 && (
                <PDPCollections
                  fields={fields}
                  rendering={rendering}
                  params={params}
                  data={productAtrributes}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

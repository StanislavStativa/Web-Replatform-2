import React, { memo, useMemo } from 'react';

import { ProductListingFields } from '@/core/molecules/ProductListing/ProductListing.type';
import ProductAPI, { UUID } from '@/core/molecules/ProductListing/ProductAPI';
import { useQuery } from '@tanstack/react-query';
import { ProductList_PAYLOAD_CONTENT, PRODUCTLIST_SORT } from '@/config';
import { getPriceGroup } from '@/utils/getPriceGroup';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ProductListing from '@/core/molecules/ProductListing/ProductListing';

type ITypesKitCardsListing = {
  DefaultItemsPerPageMobile: {
    jsonValue: Field<string>;
  };
  DefaultItemsPerPageDesktop: {
    jsonValue: Field<string>;
  };

  DiscoverRfkId: {
    jsonValue: Field<string>;
  };
  id: string;
  ButtonText: {
    jsonValue: TextField;
  };
  ButtonFunctionality: {
    jsonValue: Field<string>;
  };
};

const KitCardsListing = ({
  DefaultItemsPerPageMobile,
  DefaultItemsPerPageDesktop,
  DiscoverRfkId,
  id,
  ButtonText,
  ButtonFunctionality,
}: ITypesKitCardsListing) => {
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;

  // fetch data for filters
  // get default items per page
  const defaultItems = isMobile ? DefaultItemsPerPageMobile : DefaultItemsPerPageDesktop;
  const priceGroup = getPriceGroup();

  const payload = useMemo(
    () => ({
      context: {
        page: { uri: '' },
        store: { id: priceGroup },
        user: { uuid: UUID },
      },
      widget: { rfkid: DiscoverRfkId?.jsonValue?.value },
      n_item: Number(defaultItems?.jsonValue?.value),
      page_number: 1,
      facet: { all: true },
      sort: { value: [{ name: PRODUCTLIST_SORT, order: 'desc' }], choices: true },
      content: {
        product: {
          field: {
            value: ProductList_PAYLOAD_CONTENT,
          },
        },
      },
    }),
    [DiscoverRfkId, defaultItems, priceGroup]
  );
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['productData', id, DiscoverRfkId?.jsonValue?.value],
    queryFn: () => ProductAPI({ pageParam: payload }),
    enabled: DiscoverRfkId?.jsonValue?.value !== undefined,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading || isFetching ? (
        <div className="component grid grid-cols-1 md:grid-cols-3 mx-8 mt-5 gap-5 md:gap-6">
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-64 h-64 skeleton"></div>
            <div className="flex flex-col w-64 h-16 my-2 skeleton"></div>
            <div className="flex flex-col w-64 h-16 my-2 skeleton"></div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-64 h-64 skeleton"></div>
            <div className="flex flex-col w-64 h-16 my-2 skeleton"></div>
            <div className="flex flex-col w-64 h-16 my-2 skeleton"></div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-64 h-64 skeleton"></div>
            <div className="flex flex-col w-64 h-16 my-2 skeleton"></div>
            <div className="flex flex-col w-64 h-16 my-2 skeleton"></div>
          </div>
        </div>
      ) : (
        <ProductListing
          key={Date.now()}
          products={data}
          rendering={
            { params: {}, fields: {} } as ComponentRendering & {
              params: ComponentParams;
              fields: ProductListingFields;
            }
          }
          params={{}}
          btnText={ButtonText}
          btnFunctionality={ButtonFunctionality}
          extendedStyling
        />
      )}
    </>
  );
};

export default memo(KitCardsListing);

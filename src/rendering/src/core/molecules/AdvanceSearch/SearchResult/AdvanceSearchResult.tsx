import React, { useCallback, useEffect, useState } from 'react';
import {
  ITypesAdvanceSearchResult,
  ITypesModifiedSearchData,
  ITypesSearchResultTableData,
} from './AdvanceSearchResult.type';
import Image from '@/core/atoms/Image/Image';
import Table from '@/core/atoms/Table/Table';
import Pagination from '@/core/atoms/Pagination/Pagination';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import { useI18n } from 'next-localization';
import { addressBookTablePageList, ORDERTYPEMAP, PDPURL } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import { useRouter } from 'next/router';

import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { formatDate } from '@/utils/dateUtils';
import { RichText } from '@sitecore-jss/sitecore-jss-nextjs';
const AdvanceSearchResult = ({
  id,
  Icon,
  isOrderHistory,
  isSelectionSheet,
  handleBack,
  docType,
  isQuotes,
  description,
  currentIdStatus,
  uniqueId,
  isBillingHistory,
}: ITypesAdvanceSearchResult) => {
  const { t } = useI18n();
  const [pageSize, setPageSize] = useState<number | undefined>(5);
  const [apiDocType, setApiDocType] = useState(docType);
  const router = useRouter();
  const [detailsListData, setDetailsListData] = useState([]);
  const [calculationSummary, setCalculationSummary] = useState([]);
  const [detailStatus, setDetailStatus] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    store: '',
    shipAddress: {
      name: '',
      street: '',
      city: '',
      regionCode: '',
      zipCode: '',
    },
    customer: {
      name: '',
      street: '',
      city: '',
      regionCode: '',
      zipCode: '',
    },
  });
  const [poNumber, setPoNumber] = useState('');
  const [date, setDate] = useState('');
  const [orderType, setOrderType] = useState<number>(0);
  const columns: ITypesTable<ITypesSearchResultTableData>['columns'] = [
    { header: t('label_SKU'), accessor: 'sku' },
    { header: t('label_Image'), accessor: 'image' },
    { header: t('Cart_Description'), accessor: 'description' },
    { header: t('label_Status'), accessor: 'status' },
    { header: t('Labels_Store'), accessor: 'store' },
    { header: t('label_QTY'), accessor: 'qty' },
    { header: t('label_Retail_Price_Each'), accessor: 'retailPrice' },
    { header: t('label_Your_Price_Each'), accessor: 'yourPrice' },
    { header: t('label_your_total'), accessor: 'yourTotal' },
  ];

  const descriptionHtml = description?.value || '';
  const updatedDescription = descriptionHtml
    ?.replace('{documentId}', id?.replace(/SS/g, ''))
    ?.replace('{status}', currentIdStatus || detailStatus);
  const content = {
    value: updatedDescription,
  };

  const { data: searchDetailsData, isLoading: isSearchDetailsLoading } = useQuery({
    queryKey: ['getSearchDetails', id, apiDocType, router?.pathname, uniqueId],
    queryFn: () => {
      return MyAccountService.myAccountGetDocumentHeaderPartner(apiDocType, id);
    },
    enabled: Boolean(id !== '' && apiDocType !== ''),
  });
  const { data: orderDetailsData, isLoading: isOrderDetailsLoading } = useQuery({
    queryKey: ['getOrderDetails', id, isOrderHistory, isBillingHistory, router?.pathname, uniqueId],
    queryFn: () => {
      return MyAccountService.myAccountGetOrderDetail(id);
    },
    enabled: Boolean(id !== '' && (isOrderHistory || isBillingHistory)),
  });
  const { data: selectionDetailsData, isLoading: isSelectionDetailsLoading } = useQuery({
    queryKey: ['GetSelectionSheetDetail', id, isSelectionSheet, router?.pathname, uniqueId],
    queryFn: () => {
      return MyAccountService.myAccountGetSelectionSheetDetail(id);
    },
    enabled: Boolean(id !== '' && isSelectionSheet),
  });
  const { data: quotesDetailsData, isLoading: isQuotesDetailsLoading } = useQuery({
    queryKey: ['GetSelectionSheetDetail', id, isQuotes, router?.pathname, uniqueId],
    queryFn: () => {
      return MyAccountService.myAccountGetQuoteDetail(id);
    },
    enabled: Boolean(id !== '' && isQuotes),
  });

  const handleSelectingPageSize = useCallback((currentPageSize: number | undefined) => {
    setPageSize(currentPageSize);
  }, []);

  const viewDocumentDetails = (id: string) => {
    router.push(`${PDPURL}/${id}`);
  };

  useEffect(() => {
    if (searchDetailsData) {
      const getWe = searchDetailsData?.find((item: { role: string }) => item?.role === 'WE');
      const getAg = searchDetailsData?.find((item: { role: string }) => item?.role === 'AG');

      setOrderDetails((prev) => ({
        ...prev, // Copy the previous state
        shipAddress: {
          name: getWe?.address?.name1 ?? '',
          street: getWe?.address?.street ?? '',
          city: getWe?.address?.city ?? '',
          regionCode: getWe?.address?.regionCode ?? '',
          zipCode: getWe?.address?.zip ?? '',
        },
        customer: {
          name: getAg?.address?.name1 ?? '',
          street: getAg?.address?.street ?? '',
          city: getAg?.address?.city ?? '',
          regionCode: getAg?.address?.regionCode ?? '',
          zipCode: getWe?.address?.zip ?? '',
        },
      }));
    }
  }, [searchDetailsData]);

  useEffect(() => {
    if (orderDetailsData) {
      setApiDocType(orderDetailsData?.documentType);
      const getStoreName = orderDetailsData?.header?.zzcustom?.salesOrganizations?.find(
        (item: { vkorg: string }) =>
          item?.vkorg === orderDetailsData?.header?.zzcustom?.salesOrganization
      );
      setDetailStatus(orderDetailsData?.header?.status);
      setOrderDetails((prev) => ({
        ...prev,
        store: getStoreName ? getStoreName?.vtext : prev.store,
      }));
      const itemsList = orderDetailsData?.items;
      setPoNumber(orderDetailsData?.header?.referenceNumber);
      setDate(orderDetailsData?.header?.purchaseOrderDate);
      setOrderType(orderDetailsData?.header?.zzcustom?.orderType);
      setCalculationSummary(orderDetailsData?.header?.conditions || []);
      if (itemsList?.length > 0) {
        const modifiedItemsList = itemsList?.map((item: ITypesModifiedSearchData) => {
          const modifyingProductSku = item.extMaterialNumber?.replace(/SS/g, '');
          const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${modifyingProductSku}?$PDPThumbnail$`;
          return {
            id: modifyingProductSku,
            sku: item.extMaterialNumber,
            image: productImage,
            description: <p className="md:w-20 text-wrap">{item?.description}</p>,
            status: item?.status,
            store: '',
            qty: `${item?.quantity} ${item?.unit}`,
            retailPrice: `$${Number(item?.grossPrice)?.toFixed(2)}`,
            yourPrice: `$${Number(item?.netPrice)?.toFixed(2)}`,
            yourTotal: `$${Number(item?.netValue)?.toFixed(2)}`,
          };
        });
        setDetailsListData(modifiedItemsList);
      } else {
        setDetailsListData([]);
        setCalculationSummary([]);
      }
    } else {
      setDetailsListData([]);
      setCalculationSummary([]);
    }
  }, [orderDetailsData]);
  useEffect(() => {
    if (selectionDetailsData) {
      setApiDocType(selectionDetailsData?.documentType);
      const getStoreName = selectionDetailsData?.header?.zzcustom?.salesOrganizations?.find(
        (item: { vkorg: string }) =>
          item?.vkorg === selectionDetailsData?.header?.zzcustom?.salesOrganization
      );
      setDetailStatus(selectionDetailsData?.header?.status);
      setOrderDetails((prev) => ({
        ...prev,
        store: getStoreName ? getStoreName?.vtext : prev.store,
      }));
      setPoNumber(selectionDetailsData?.header?.referenceNumber);
      setDate(selectionDetailsData?.header?.purchaseOrderDate);
      setOrderType(selectionDetailsData?.header?.zzcustom?.orderType);
      const itemsList = selectionDetailsData?.items;
      setCalculationSummary(selectionDetailsData?.header?.conditions || []);
      if (itemsList?.length > 0) {
        const modifiedItemsList = itemsList?.map((item: ITypesModifiedSearchData) => {
          const modifyingProductSku = item.extMaterialNumber?.replace(/SS/g, '');
          const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${modifyingProductSku}?$PDPThumbnail$`;
          return {
            id: modifyingProductSku,
            sku: modifyingProductSku,
            image: productImage,
            description: <p className="md:w-20 text-wrap">{item?.description}</p>,
            status: item?.status,
            store: '',
            qty: `${item?.quantity} ${item?.unit}`,
            retailPrice: `$${Number(item?.grossPrice)?.toFixed(2)}`,
            yourPrice: `$${Number(item?.netPrice)?.toFixed(2)}`,
            yourTotal: `$${Number(item?.netValue)?.toFixed(2)}`,
          };
        });
        setDetailsListData(modifiedItemsList);
      } else {
        setDetailsListData([]);
        setCalculationSummary([]);
      }
    } else {
      setDetailsListData([]);
      setCalculationSummary([]);
    }
  }, [selectionDetailsData]);

  useEffect(() => {
    if (quotesDetailsData) {
      setApiDocType(quotesDetailsData?.documentType);
      const getStoreName = quotesDetailsData?.header?.zzcustom?.salesOrganizations?.find(
        (item: { vkorg: string }) =>
          item?.vkorg === quotesDetailsData?.header?.zzcustom?.salesOrganization
      );
      setDetailStatus(quotesDetailsData?.header?.status);
      setOrderDetails((prev) => ({
        ...prev,
        store: getStoreName ? getStoreName?.vtext : prev.store,
      }));
      const itemsList = quotesDetailsData?.items;
      setPoNumber(quotesDetailsData?.header?.referenceNumber);
      setDate(quotesDetailsData?.header?.purchaseOrderDate);
      setOrderType(quotesDetailsData?.header?.zzcustom?.orderType);
      setCalculationSummary(quotesDetailsData?.header?.conditions || []);
      if (itemsList?.length > 0) {
        const modifiedItemsList = itemsList?.map((item: ITypesModifiedSearchData) => {
          const modifyingProductSku = item.extMaterialNumber?.replace(/SS/g, '');
          const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${modifyingProductSku}?$PDPThumbnail$`;
          return {
            id: modifyingProductSku,
            sku: modifyingProductSku,
            image: productImage,
            description: <p className="md:w-20 text-wrap">{item?.description}</p>,
            status: item?.status,
            store: '',
            qty: `${item?.quantity} ${item?.unit}`,
            retailPrice: `$${Number(item?.grossPrice)?.toFixed(2)}`,
            yourPrice: `$${Number(item?.netPrice)?.toFixed(2)}`,
            yourTotal: `$${Number(item?.netValue)?.toFixed(2)}`,
          };
        });
        setDetailsListData(modifiedItemsList);
      } else {
        setDetailsListData([]);
        setCalculationSummary([]);
      }
    } else {
      setDetailsListData([]);
      setCalculationSummary([]);
    }
  }, [quotesDetailsData]);

  return (
    <>
      {(isOrderDetailsLoading ||
        isSelectionDetailsLoading ||
        isSearchDetailsLoading ||
        isQuotesDetailsLoading) && <LoaderSpinner />}
      <div>
        <button className="text-xs font-bold mb-3" onClick={handleBack}>
          <span>{`<`}</span> {t('label_Back')}
        </button>
      </div>
      <div
        key={id}
        className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-10"
      >
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <div className="w-full">
            <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
              <div className="flex md:items-center items-start">
                <div className="hidden md:block w-12 h-10 mr-8">
                  <Image field={Icon} />
                </div>
                <RichText
                  className="text-left text-xl font-semibold advance-result_rte"
                  field={content}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
          <div className="flex flex-col gap-9 md:grid grid-cols-1 md:grid-cols-12 ">
            <div className="col-span-2 ">
              <p className="text-xs font-bold">{t('Labels_Store')}</p>
              <p>{orderDetails?.store}</p>
            </div>
            <div className="col-span-2 md:col-start-4">
              <p className="text-xs font-bold">{t('label_Date')}</p>
              <p>{formatDate(date)}</p>
            </div>
            <div className="col-span-2 md:col-start-6 pl-5">
              <p className="text-xs font-bold">{t('label_PO_Number')}</p>
              <p>{poNumber}</p>
            </div>
            <div className="col-span-2 md:col-start-8 pl-5">
              <p className="text-xs font-bold">{t('Labels_OrderType')}</p>
              <p>{ORDERTYPEMAP[orderType]}</p>
            </div>
            <div className="row-start-2 col-span-3">
              <p className="text-xs font-bold">{t('Invoice_Customer')}</p>
              <div className="max-w-44 text-wrap flex flex-col">
                <p className="text-wrap break-words">{orderDetails?.customer?.name}</p>
                <p className="text-wrap break-words">{orderDetails?.customer?.street}</p>
                <p className="text-wrap break-words">
                  {orderDetails?.customer?.city} {orderDetails?.customer?.regionCode}{' '}
                  {orderDetails?.customer?.zipCode}
                </p>
              </div>
            </div>
            <div className="row-start-2 col-span-3">
              <p className="text-xs font-bold">{t('Labels_ShippingAddress')}</p>
              <div className="max-w-44 text-wrap flex flex-col">
                <p className="text-wrap break-words">{orderDetails?.shipAddress?.name}</p>
                <p className="text-wrap break-words">{orderDetails?.shipAddress?.street}</p>
                <p className="text-wrap break-words">
                  {orderDetails?.shipAddress?.city} {orderDetails?.shipAddress?.regionCode}{' '}
                  {orderDetails?.shipAddress?.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center  mb-8 md:mb-16   pb-13 bg-white gap-10">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <Table
            data={detailsListData}
            columns={columns}
            sortable
            clickableColumns={['sku', 'image']}
            isClickableUnderLine
            onCellClick={viewDocumentDetails}
            imageColumns={['image']}
            isMobileHalFNHalf
          />

          <div className="w-full flex justify-between px-8">
            <div className="flex-1 hidden md:block" />
            <div className="flex-1 flex justify-between flex-row">
              <div className="flex-1 hidden md:block" />
              <div>
                {calculationSummary?.length > 0 &&
                  calculationSummary?.map(
                    (item: { id: number; description: string; netValue: string }) => {
                      return (
                        <div key={item?.id} className=" flex flex-row gap-16">
                          <p className="font-medium min-w-28">
                            {item?.description?.replace(/[:/].*$/, '')}
                          </p>
                          <p className="font-bold">
                            {item?.netValue !== undefined && item?.netValue !== null
                              ? `$${Number(item.netValue).toFixed(2)}`
                              : null}
                          </p>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          </div>
          <Pagination
            currentPageSize={pageSize?.toString() || '5'}
            getSelectedPageSize={handleSelectingPageSize}
            perPageList={addressBookTablePageList}
            selectClass="w-full md:w-auto justify-center md:justify-end "
          />
        </div>
      </div>
    </>
  );
};

export default AdvanceSearchResult;

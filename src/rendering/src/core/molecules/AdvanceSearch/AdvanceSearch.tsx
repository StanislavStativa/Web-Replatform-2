import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  CurrentItemList,
  ITypesAdvanceSearch,
  ITypesBillingTableData,
  ITypesOrderHistoryTable,
  ITypesPaymentTableData,
  ITypesQuotesTableData,
  ITypesSearchTableData,
} from './AdvanceSearch.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import AdvanceSearchForm from './Form/AdvanceSearchForm';
import Table from '@/core/atoms/Table/Table';
import Pagination from '@/core/atoms/Pagination/Pagination';
import { useI18n } from 'next-localization';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import { addressBookTablePageList, DOCUMNETTYPE, USEORDERENDPOINT } from '@/utils/constants';
import AdvanceSearchResult from './SearchResult/AdvanceSearchResult';
import { useRouter } from 'next/router';
import useOrderHistory from '@/hooks/useOrdersMutation';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { getAdvanceSearchParam } from '@/utils/config';
import dynamic from 'next/dynamic';
import { GoCheck } from 'react-icons/go';
import useDownloadFile from '@/hooks/useDownloadFile';
import { ITypesInvoiceSearchList } from '../SearchInvoice/SearchInvoiceTable/SearchInvoiceTable.type';
const PayInvoice = dynamic(() => import('../PayInvoice/PayInvoice'), {
  ssr: false,
  loading: () => <LoaderSpinner />,
});
const AdvanceSearch = (props: ITypesAdvanceSearch) => {
  const router = useRouter();
  const { Title, Icon, Description } = props?.rendering?.fields;
  const { uid } = props?.rendering;
  const { HeadingTag } = props?.params;
  const isQuotes = Boolean(props?.rendering?.params?.quotes);
  const isOrderHistory = Boolean(props?.rendering?.params?.['order-history']);
  const isSelectionSheet = Boolean(props?.rendering?.params?.['selection-sheets']);
  const isBillingHistory = Boolean(props?.rendering?.params?.['billing-history']);
  const isPaymentHistory = Boolean(props?.rendering?.params?.['payments-credits']);

  const { t } = useI18n();
  const {
    filters,
    searchTableData,
    fetchOrderHistory,
    message,
    isPending,
    docType,
    totalPaymentAmount,
  } = useOrderHistory();
  const { mutate: download, isPending: isDownloading } = useDownloadFile();
  const [pageSize, setPageSize] = useState<number | undefined>(25);
  const [selectedIdToPreview, setSelectedIdToPreview] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [searchTableList, setSearchTableList] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [isPayAmount, setPayAmount] = useState<boolean>(false);
  const [currentIdStatus, setCurrentIdStatus] = useState<string>('');
  const [billSelectedInvoices, setBillSelectedInvoices] = useState<ITypesInvoiceSearchList[] | []>(
    []
  );
  const columns: ITypesTable<ITypesSearchTableData>['columns'] = [
    { header: t('label_Status'), accessor: 'status' },
    { header: t('label_Document_Number'), accessor: 'documentNumber' },
    { header: t('label_Date'), accessor: 'date' },
    { header: t('Invoice_PONumber'), accessor: 'poNumber' },
    { header: t('label_Reffered'), accessor: 'referred' },
    { header: t('label_Order_Total'), accessor: 'orderTotal' },
  ];
  const columnsQuotes: ITypesTable<ITypesQuotesTableData>['columns'] = [
    { header: t('label_Status'), accessor: 'status' },
    { header: t('label_Document_Number'), accessor: 'documentNumber' },
    { header: t('label_Date'), accessor: 'date' },
    { header: t('label_Purchase_Order'), accessor: 'purchaseOrder' },
    { header: t('label_Reffered'), accessor: 'referred' },
    { header: t('label_Order_Total'), accessor: 'orderTotal' },
  ];
  const columnsOrderHistory: ITypesTable<ITypesOrderHistoryTable>['columns'] = [
    { header: t('label_Status'), accessor: 'status' },
    { header: t('Invoice_OrderNumber'), accessor: 'documentNumber' },
    { header: t('label_Date'), accessor: 'date' },
    { header: t('Invoice_PONumber'), accessor: 'poNumber' },
    { header: t('label_Reffered'), accessor: 'referred' },
    { header: t('label_Order_Total'), accessor: 'orderTotal' },
    { header: t('label_Customer'), accessor: 'customer' },
  ];

  const columnsPayment: ITypesTable<ITypesPaymentTableData>['columns'] = [
    { header: t('label_Document_Number'), accessor: 'documentNumber' },
    { header: t('label_Date'), accessor: 'date' },
    { header: t('label_Document_Type'), accessor: 'documentType' },
    { header: t('label_Clearing_Date'), accessor: 'clearingDate' },
    { header: t('label_Po_Number'), accessor: 'poNumber' },
    { header: t('Invoice_Invoice'), accessor: 'invoice' },
    { header: t('label_Amount'), accessor: 'amount' },
    { header: t('label_Customer'), accessor: 'customer' },
  ];
  const columnsBilling: ITypesTable<ITypesBillingTableData>['columns'] = [
    { header: t('label_Status'), accessor: 'status' },
    { header: t('Invoice_Invoice'), accessor: 'invoice' },
    { header: t('label_Order_Number'), accessor: 'orderNumber' },
    { header: t('label_Po_Number'), accessor: 'poNumber' },
    { header: t('label_Date'), accessor: 'date' },
    { header: t('label_Sale_Total'), accessor: 'saleTotal' },
    { header: t('Invoice_Paid'), accessor: 'paid' },
    { header: t('Invoice_Open'), accessor: 'open' },
    { header: t('Invoice_DueDate'), accessor: 'dueDate' },
    { header: t('Invoice_In'), accessor: 'in' },
    { header: t('label_Customer'), accessor: 'customer' },
  ];

  const columnConfigs = {
    billingHistory: columnsBilling,
    paymentHistory: columnsPayment,
    quotes: columnsQuotes,
    orderHistory: columnsOrderHistory,
    default: columns,
  };
  const columnParm = getAdvanceSearchParam(
    isBillingHistory,
    isPaymentHistory,
    isQuotes,
    isOrderHistory
  );
  const currentItems =
    pageSize === undefined
      ? searchTableList
      : searchTableList.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const handleSelectingPageSize = useCallback((currentPageSize: number | undefined) => {
    setPageSize(currentPageSize);
    setCurrentPage(0); // Reset to first page on page size change
  }, []);

  const downloadPdfFile = (id: string) => {
    const getSelectedInvoice = currentItems?.find((item: { id: string }) => item?.id === id) || {
      id: '',
      in: '',
    };

    const wecoFilter = {
      siteId: '',
      status: '',
      statusDue: '',
      period: '',
      searchBy: '',
      customer: '',
      shipToSelection: '',
      downloadType: DOCUMNETTYPE.PDF,
      documentType: docType,
      docNumber: id,
      pdfsId: getSelectedInvoice !== undefined ? getSelectedInvoice?.in : '',
    };
    download(wecoFilter);
  };

  const viewDocumentDetails = (id: string, column?: string, status?: string) => {
    if (isBillingHistory && column === undefined) {
      downloadPdfFile(id);
      return;
    } else if (isBillingHistory && column === 'invoice') {
      const getCurrentIdDetails = currentItems?.find((item: { id: string }) => item?.id === id);
      if (getCurrentIdDetails !== undefined) {
        setBillSelectedInvoices([getCurrentIdDetails]);
        setPayAmount(true);
      }
    } else if (isBillingHistory && column === 'orderNumber') {
      const currentItemsData: CurrentItemList[] | undefined = currentItems;
      const getCurrentIdDetails = currentItemsData?.find(
        (item: { id: string; orderNumber: string; status: string }) => item?.id === id
      );
      if (getCurrentIdDetails !== undefined) {
        setCurrentIdStatus(getCurrentIdDetails?.status || '');
        setSelectedIdToPreview(`00${getCurrentIdDetails?.orderNumber}`);
        setShowDetails(true);
      }
    } else {
      setCurrentIdStatus(status || '');
      setSelectedIdToPreview(id);
      setShowDetails(true);
    }
  };

  const togglePayInvoice = useCallback(() => {
    setPayAmount((prev) => !prev);
  }, []);
  const handleBack = () => {
    setSelectedIdToPreview(null);
    setCurrentIdStatus('');
    setShowDetails(false);
  };
  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };
  const downloadXls = () => {
    setIsDownload(true);
    setTimeout(() => {
      setIsDownload(false);
    }, 2000);
  };
  const wecoFilter = {
    siteId: '',
    status: '',
    statusDue: '',
    period: '',
    searchBy: '',
    customer: '',
    shipToSelection: '',
    orderType: '',
    currency: '',
    filterBy: '',
  };
  // getting initial filter and predefined data
  useEffect(() => {
    if (isQuotes) {
      fetchOrderHistory(wecoFilter, USEORDERENDPOINT.QUOTES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuotes, router.pathname]);
  useEffect(() => {
    if (isSelectionSheet) {
      fetchOrderHistory(wecoFilter, USEORDERENDPOINT.SELECTION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectionSheet, router.pathname]);
  useEffect(() => {
    if (isOrderHistory) {
      fetchOrderHistory(wecoFilter, USEORDERENDPOINT.ORDER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderHistory, router.pathname]);
  useEffect(() => {
    if (isBillingHistory) {
      fetchOrderHistory(wecoFilter, USEORDERENDPOINT.BILLING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBillingHistory, router.pathname]);
  useEffect(() => {
    if (isPaymentHistory) {
      fetchOrderHistory(wecoFilter, USEORDERENDPOINT.PAYMENT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentHistory, router.pathname]);

  useEffect(() => {
    if (searchTableData) {
      const modifyContent = searchTableData.map((item) => {
        return {
          ...item,
          referred: (
            <p className="w-16 md:w-auto text-wrap">
              {String(item?.referred) === '2' ? <GoCheck /> : ''}
            </p>
          ), // Wrap customer value in <p> tag
        };
      });
      setSearchTableList(modifyContent as []);
    }
  }, [searchTableData]);

  return (
    <section key={uid} className="pb-17 md:mb-10 md:py-14 container mx-auto px-4">
      {isPayAmount && billSelectedInvoices?.length > 0 ? (
        <PayInvoice
          icon={Icon}
          goBack={togglePayInvoice}
          selectedInvoices={billSelectedInvoices}
          amountAssigned={Number(billSelectedInvoices?.[0]?.orderTotal?.replace('$', '')) || 0}
          isPayAccount={true}
        />
      ) : (
        <>
          {(isPending || isDownloading) && <LoaderSpinner />}
          {showDetails ? (
            <AdvanceSearchResult
              id={selectedIdToPreview as string}
              Icon={Icon}
              Title={Title}
              isQuotes={isQuotes}
              isOrderHistory={isOrderHistory}
              isBillingHistory={isBillingHistory}
              isSelectionSheet={isSelectionSheet}
              handleBack={handleBack}
              docType={docType}
              description={Description}
              currentIdStatus={currentIdStatus}
              uniqueId={new Date().getTime()}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-10 gap-y-8">
                <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
                  <div className="w-full">
                    <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
                      <div className="flex md:items-center items-start">
                        <div className="hidden md:block w-12 h-10 mr-8">
                          <Image field={Icon} />
                        </div>
                        <Text
                          tag={HeadingTag || 'h2'}
                          className="text-left text-xl font-semibold"
                          field={Title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
                  <AdvanceSearchForm
                    filters={filters}
                    isQuotes={isQuotes}
                    isOrderHistory={isOrderHistory}
                    isSelectionSheet={isSelectionSheet}
                    isPaymentHistory={isPaymentHistory}
                    isBillingHistory={isBillingHistory}
                    fetchOrderHistory={fetchOrderHistory}
                    message={message}
                    isDownload={isDownload}
                    docType={docType}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 justify-center  mb-8 md:mb-16   pb-13 bg-white gap-10">
                {searchTableList?.length > 0 && (
                  <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
                    <Table
                      data={currentItems}
                      columns={columnConfigs[columnParm]}
                      sortable
                      clickableColumns={
                        isBillingHistory
                          ? ['invoice', 'orderNumber']
                          : isPaymentHistory
                            ? []
                            : ['documentNumber']
                      }
                      isClickableUnderLine
                      onCellClick={viewDocumentDetails}
                      filesColumns={isBillingHistory ? ['in'] : []}
                      modifyCssColumns={isBillingHistory ? ['open'] : []}
                      customColumnsStyle={'text-light-slate-red'}
                      // isMobileClassName={'pr-16'}
                      isMobileHalFNHalf
                    />
                    {isPaymentHistory && (
                      <div className="w-full flex flex-col gap-3 justify-end  border-t-2 border-t-gray p-9">
                        <div className=" flex flex-row gap-13 justify-end">
                          <p className="font-medium">{t('OrderReview_Total')}</p>
                          <p className="font-bold">{`$${totalPaymentAmount?.toFixed(2)}`}</p>
                        </div>
                      </div>
                    )}

                    <Pagination
                      perPageList={addressBookTablePageList}
                      currentPageSize={pageSize?.toString() || '5'}
                      getSelectedPageSize={handleSelectingPageSize}
                      totalItems={searchTableList?.length}
                      itemsPerPage={pageSize || 5}
                      isPaging
                      onPageChange={handlePageChange}
                      isDownload
                      onDownload={downloadXls}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default memo(AdvanceSearch);

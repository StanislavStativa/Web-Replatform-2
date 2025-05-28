import React, { memo, useCallback, useEffect, useState } from 'react';
import { ITypesModifiedProjectList, ITypesPdf, ITypesSearchInvoice } from './SearchInvoice.type';
import Image from '@/core/atoms/Image/Image';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useForm } from 'react-hook-form';
// import Calendar from '@/core/atoms/Calendar/Calendar';
// import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useI18n } from 'next-localization';
// import Button from '@/core/atoms/Button/Button';
import { MyAccountService } from '@/api/services/MyAccountService';
import { useMutation } from '@tanstack/react-query';
import { WECOFilterRequest } from '@/api/models/WECOFilterRequest';
import dynamic from 'next/dynamic';
import { ITypesInvoiceSearchList } from './SearchInvoiceTable/SearchInvoiceTable.type';
import Pagination from '@/core/atoms/Pagination/Pagination';
import {
  addressBookTablePageList,
  DOCUMNETTYPE,
  isPDfCheckVal,
  paymentDocType,
} from '@/utils/constants';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
// import { convertDateFormat } from '@/utils/config';
import { useRouter } from 'next/router';
import useDownloadFile from '@/hooks/useDownloadFile';
// import { IoIosInformationCircleOutline } from 'react-icons/io';
import { formatDate } from '@/utils/dateUtils';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
const SearchInvoiceTable = dynamic(() => import('./SearchInvoiceTable/SearchInvoiceTable'), {
  ssr: false,
  loading: () => <p></p>,
});
const PayInvoice = dynamic(() => import('../PayInvoice/PayInvoice'), {
  ssr: false,
  loading: () => <LoaderSpinner />,
});

const SearchInvoice = (props: ITypesSearchInvoice) => {
  const router = useRouter();
  const { Title, Icon } = props?.rendering?.fields;
  const { uid } = props?.rendering;
  const { HeadingTag } = props?.params;
  const { t } = useI18n();

  const [searchList, setSearchList] = useState<ITypesInvoiceSearchList[] | []>([]);
  const [totalOpenAmount, setTotalOpenAmount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [amountAssigned, setAmountAssigned] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isPayInvoice, setIsPayInvoice] = useState<boolean>(false);
  const [selectedInvoices, setSelectedInvoices] = useState<ITypesInvoiceSearchList[] | []>([]);
  const [docType, setDocType] = useState<string>('');
  // const [message, setMessage] = useState('');
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [showZeroSelectedError, setZeroSelectedError] = useState<boolean>(false);

  const currentItems =
    pageSize === undefined
      ? searchList
      : searchList.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const {
    mutate: download,
    isPending: isDownloading,
    isError: isDownloadError,
  } = useDownloadFile();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: WECOFilterRequest) => {
      return await MyAccountService.myAccountSearchForInvoices(data);
    },
    onSuccess: (data) => {
      if (data) {
        setDocType(data?.documentType);
        setTotalOpenAmount(data?.totals?.[0]?.netValueOpen);
        const docs = data?.documents;
        if (docs?.length > 0) {
          // setMessage('');

          const modifiedProjectList = docs?.map(
            (item: ITypesModifiedProjectList, index: number) => {
              // const splitDate = item?.date?.split('-');

              // const getFiscalYear = splitDate?.find((part) => /^\d{4}$/?.test(part));
              const isPdf =
                item?.pdfs?.length > 0 &&
                item?.pdfs?.filter((item: ITypesPdf) => item?.headerDescription === isPDfCheckVal);
              return {
                id:
                  item?.zzcustom?.orderNumber === ''
                    ? item?.id + index
                    : item?.zzcustom?.orderNumber + index,
                invoice:
                  item?.financeDocumentType === 'Z3' && item?.referenceNumber?.trim()
                    ? item.referenceNumber
                    : item?.id,
                fiDocumentNumber: item?.fiDocumentNumber,
                orderNumber: item?.zzcustom?.orderNumber,
                poNumber: item?.zzcustom?.referenceNumber ?? '',
                date: formatDate(item?.documentDate),
                fiscalYear: item?.fiscalYear,
                saleTotal:
                  Number(item?.total) < 0
                    ? `-$${Math.abs(Number(item?.total)).toFixed(2)}`
                    : `$${Number(item?.total).toFixed(2)}`,
                // saleTotal: `$${Number(item?.total)?.toFixed(2)}`,
                paid: `$${Number(item?.valuePayed)?.toFixed(2)}`,
                open: (
                  <p
                    className={`${Number(item?.valueOpen) < 0 ? 'text-green-600' : 'text-light-slate-red'}`}
                  >
                    {Number(item?.valueOpen) < 0
                      ? `-$${Math.abs(Number(item?.valueOpen)).toFixed(2)}`
                      : `$${Number(item?.valueOpen)?.toFixed(2)}`}
                  </p>
                ),

                dueDate: formatDate(item?.dueTo),
                in: item?.zzcustom?.orderNumber === '' ? '' : isPdf ? `${isPdf[0]?.id}` : '',
                customer: <p className="w-28 whitespace-break-spaces">{item?.customerAddress}</p>,
                netValue: item?.total,
                notUnderline: Boolean(item?.zzcustom?.orderNumber !== ''),
                documentType: item?.financeDocumentType
                  ? t(paymentDocType[item?.financeDocumentType])
                  : t('Payment_Invoice'),

                openValue:
                  Number(item?.valueOpen) < 0
                    ? `-${Math.abs(Number(item?.valueOpen)).toFixed(2)}`
                    : `${Number(item?.valueOpen)?.toFixed(2)}`,
                fiDocumentLineItem: item?.fiDocumentLineItem,
              };
            }
          );
          setSearchList(modifiedProjectList);
        } else {
          // setMessage(data?.messages?.[0]?.message);
          setSearchList([]);
        }
      } else {
        setTotalOpenAmount(0);
        setSearchList([]);
      }
    },
    onError: () => {
      setTotalOpenAmount(0);
      setSearchList([]);
    },
  });
  const reftech = () => {
    const wecoFilter = {
      siteId: '',
      status: '',
      statusDue: '',
      period: '',
      searchBy: '',
      customer: '',
      shipToSelection: '',
    };
    mutate(wecoFilter);
  };
  const getCheckedCol = useCallback((selectedRows: string[]) => {
    setSelectedColumns(selectedRows);
  }, []);

  const handleSelectingPageSize = useCallback((currentPageSize: number | undefined) => {
    setPageSize(currentPageSize);
    setCurrentPage(0); // Reset to first page on page size change
  }, []);

  const togglePayInvoice = () => {
    // const isZeroOrNegativeNetValueAmount = selectedInvoices?.find(
    //   (item: ITypesInvoiceSearchList) => {
    //     const openValue = parseFloat(item?.open?.replace('$', '')); // Remove '$' and convert to a number
    //     return openValue === 0 || openValue < 0; // Check for zero or negative values
    //   }
    // );
    if (amountAssigned <= 0) {
      setZeroSelectedError(true);
    } else {
      setZeroSelectedError(false);
      setIsPayInvoice(true);
    }
  };

  const closePayInvoice = () => {
    setIsPayInvoice(false);
    setSelectedColumns([]);
    setTotalOpenAmount(0);
  };

  const downloadFile = (id: string) => {
    const getSelectedInvoice = currentItems?.find((item) => item?.id === id);
    const wecoFilter = {
      siteId: '',
      status: '',
      statusDue: '',
      period: '',
      searchBy: '',
      customer: '',
      shipToSelection: '',
      downloadType: DOCUMNETTYPE.PDF,
      documentType: '903',
      docNumber: getSelectedInvoice && getSelectedInvoice?.invoice,
      pdfsId: '300', //Need to pass as current api don't have pdf id if present then can get with "getSelectedInvoice.in",
    };
    download(wecoFilter);
  };

  useEffect(() => {
    const wecoFilter = {
      siteId: '',
      status: '',
      statusDue: '',
      period: '',
      searchBy: '',
      customer: '',
      shipToSelection: '',
    };
    mutate(wecoFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, isPayInvoice]);

  const formMethods = useForm({
    defaultValues: {
      periodTo: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  });

  const downloadXls = () => {
    setIsDownload(true);
    setTimeout(() => {
      setIsDownload(false);
    }, 2000);
  };

  useEffect(() => {
    setZeroSelectedError(false);
    if (selectedColumns?.length > 0 && searchList?.length > 0) {
      const matched = searchList.filter((item: ITypesInvoiceSearchList) =>
        selectedColumns.includes(item.id)
      );
      setSelectedInvoices(matched);
    } else if (!isPayInvoice) {
      setSelectedInvoices([]);
    }
  }, [selectedColumns, searchList, isPayInvoice]);

  // const onSubmit: SubmitHandler<{ periodTo: string }> = (data) => {
  //   const date = convertDateFormat(data?.periodTo);
  //   const wecoFilter = {
  //     siteId: '',
  //     status: '01',
  //     statusDue: date,
  //     period: `000`,
  //     searchBy: '',
  //     customer: '',
  //     shipToSelection: '',
  //   };
  //   mutate(wecoFilter);
  // };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const handleCloseMessage = () => {
    setZeroSelectedError(false);
  };

  useEffect(() => {
    if (selectedInvoices && selectedInvoices?.length > 0) {
      let totalOpen = 0;

      selectedInvoices.forEach((invoice: ITypesInvoiceSearchList) => {
        // Extract 'open' value, remove '$', and convert to number

        const openAmountText = invoice?.open?.props?.children;

        const openAmount = parseFloat(openAmountText.replace('$', ''));
        totalOpen += openAmount;
      });

      setAmountAssigned(totalOpen);
    } else {
      setAmountAssigned(0);
    }
  }, [selectedInvoices]);

  useEffect(() => {
    if (isDownload === true) {
      const wecoFilter = {
        siteId: '',
        status: '',
        statusDue: '',
        period: `${formMethods.getValues('periodTo')}`,
        searchBy: '',
        customer: '',
        shipToSelection: '',
        downloadType: DOCUMNETTYPE.XLSX,
        documentType: docType,
      };

      download(wecoFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownload]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showZeroSelectedError) {
      timeoutId = setTimeout(() => {
        setZeroSelectedError(false);
      }, 20000);
    }

    return () => clearTimeout(timeoutId);
  }, [showZeroSelectedError]);
  return (
    <>
      {(isPending || isDownloading) && <LoaderSpinner />}
      <section key={uid} className="pb-17  md:py-11 container mx-auto px-4">
        {showZeroSelectedError && (
          <NotificationMessage
            message={t('Payment_Invoice_Error')}
            onCancel={handleCloseMessage}
            isCloseable
          />
        )}
        {isDownloadError && <NotificationMessage />}
        {isPayInvoice ? (
          <PayInvoice
            icon={Icon}
            goBack={closePayInvoice}
            selectedInvoices={selectedInvoices}
            amountAssigned={amountAssigned}
            isPayAccount={false}
          />
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg
-white gap-x-10 gap-y-7"
            >
              <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
                <div className="w-full">
                  <div className="flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
                    <div className="flex md:items-center items-start">
                      <div className="hidden md:block w-11 h-11 mr-8">
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
              {/* <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
                <FormProvider {...formMethods}>
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        formMethods.handleSubmit(onSubmit)(e);
                      }}
                      className="col-span-1 md:col-span-10 md:col-start-1 flex flex-col gap-y-4"
                      id="quotes-search"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          formMethods.handleSubmit(onSubmit)();
                        }
                      }}
                    >
                      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3 md:items-start">
                        <div className="order-2 md:order-1 col-span-1">
                          <label className="mb-2 block text-xs font-medium">
                            {t('label_due_till')}
                          </label>
                          <Calendar
                            name="periodTo"
                            formMethodsValue={formMethods}
                            isDateBtn={false}
                            calendarStyles="w-full px-3"
                            placeholderText={t('label_to')}
                            isToday={true}
                            minDate={new Date()}
                          />
                          <div className="w-full md:w-auto flex justify-left gap-4 mt-6">
                            <Button
                              variant={ButtonVariant.BLACK}
                              isCTATextInCaps={props?.params?.IsCTATextInCaps}
                              isTypeSubmit={true}
                              className="w-full md:w-auto"
                            >
                              <p className="text-sm"> {t('Invoice_Search')}</p>
                            </Button>
                          </div>
                        </div>
                        <div className="order-1 md:order-2 col-span-2">
                          <p className="text-base font-medium lg:whitespace-pre-wrap">
                            {t('pay_open_invoice_message')?.replace('.', '.\n')}
                          </p>
                        </div>
                      </div>

                      {message?.length > 0 && (
                        <div className="inline-flex items-center gap-x-2 bg-tonal-gray border mx-1 p-3 mr-4 mb-2 mt-2">
                          <IoIosInformationCircleOutline size={'15px'} />
                          <p className="text-xs">{message}</p>
                        </div>
                      )}
                    </form>
                  </div>
                </FormProvider>
              </div> */}
            </div>
            {searchList?.length > 0 && (
              <>
                <SearchInvoiceTable
                  searchList={currentItems as ITypesInvoiceSearchList[]}
                  getCheckedCol={getCheckedCol}
                  selectedColumns={selectedColumns}
                  openPayInvoice={togglePayInvoice}
                  downloadFile={downloadFile}
                  totalOpenAmount={totalOpenAmount}
                  amountAssigned={amountAssigned}
                  reftech={reftech}
                />
                <Pagination
                  perPageList={addressBookTablePageList}
                  currentPageSize={pageSize?.toString() || '-1'}
                  getSelectedPageSize={handleSelectingPageSize}
                  totalItems={searchList.length}
                  itemsPerPage={pageSize || 5}
                  isPaging
                  onPageChange={handlePageChange}
                  isDownload
                  onDownload={downloadXls}
                />
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default memo(SearchInvoice);

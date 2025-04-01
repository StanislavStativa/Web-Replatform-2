import React, { memo, useCallback, useEffect, useState } from 'react';
import { ITypesBillingStatements } from './BillingStatements.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import Pagination from '@/core/atoms/Pagination/Pagination';
import { addressBookTablePageList, DOCUMNETTYPE } from '@/utils/constants';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import Table from '@/core/atoms/Table/Table';
import { TfiDownload } from 'react-icons/tfi';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import useDownloadFile from '@/hooks/useDownloadFile';
import { useI18n } from 'next-localization';
const BillingStatements = (props: ITypesBillingStatements) => {
  const { Title, Icon, SubTitle } = props?.rendering?.fields;
  const { uid } = props?.rendering;
  const { HeadingTag } = props?.params;
  const { mutate, isPending } = useDownloadFile();
  const { t } = useI18n();
  const [pageSize, setPageSize] = useState<number | undefined>(25);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [billingStatementList, setBillingStatementList] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    availableCredit: '',
    balance: '',
    creditLimit: '',
  });
  const [docType, setDocType] = useState<string>('');
  const [pdfId, setPdfId] = useState<string>('');
  const currentItems =
    pageSize === undefined
      ? billingStatementList
      : billingStatementList.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const columns: ITypesTable<{ statements: string }>['columns'] = [
    { header: t('label_Statements'), accessor: 'statements' },
  ];

  const { data: billingStatementData, isLoading } = useQuery({
    queryKey: ['getBillingStatementData'],
    queryFn: () => {
      return MyAccountService.myAccountGetStatements();
    },
  });

  const handleSelectingPageSize = useCallback((currentPageSize: number | undefined) => {
    setPageSize(currentPageSize);
  }, []);
  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };
  const viewDocumentDetails = (id: string) => {
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
      pdfsId: pdfId,
    };
    mutate(wecoFilter);
  };

  useEffect(() => {
    if (billingStatementData) {
      const docs = billingStatementData?.documents;
      setDocType(billingStatementData?.documentType);
      if (docs?.length > 0) {
        setBillingDetails({
          availableCredit: docs?.[0]?.zzcustom?.availableCredit ?? '',
          balance: docs?.[0]?.zzcustom?.balance ?? '',
          creditLimit: docs?.[0]?.zzcustom?.creditLimit ?? '',
        });
        const modifiedData = docs?.map((item: { fiText: string; id: string }) => {
          return {
            statements: (
              <p className="inline-flex items-center gap-1">
                {item?.fiText}
                <span>
                  <TfiDownload />
                </span>
              </p>
            ),
            id: item?.id,
          };
        });
        setPdfId(String(docs?.[0]?.pdfs?.[0]?.id));
        setBillingStatementList(modifiedData);
      } else {
        setBillingStatementList([]);
        setBillingDetails({
          availableCredit: '',
          balance: '',
          creditLimit: '',
        });
      }
    }
  }, [billingStatementData]);
  return (
    <section key={uid} className="pb-17 md:mb-10 md:py-14 container mx-auto px-4">
      {(isLoading || isPending) && <LoaderSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-10 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-x-10 gap-y-7">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <div className="w-full">
            <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
              <div className="flex md:items-center items-start">
                <div className="hidden md:block w-11 h-11 mr-8">
                  <Image field={Icon} />
                </div>
                <div>
                  <Text
                    tag={HeadingTag || 'h2'}
                    className="text-left text-xl font-semibold"
                    field={Title}
                  />
                  <Text
                    tag={HeadingTag || 'h4'}
                    className="text-left text-base mt-2"
                    field={SubTitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
          <div className="rounded-lg border border-gray-300 pt-6 md:py-5 pb-13 px-4 md:px-6 my-4  ">
            <div>
              <h5 className="text-base mb-5 text-center md:text-left">
                {t('label_account_summary')}
              </h5>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-center align-middle gap-4 ">
              <div className="flex-1 flex flex-col justify-center align-middle text-center">
                <p className="text-xs">{t('label_Balance')}</p>
                <p className="text-32">{billingDetails?.balance?.replace('-', '')}</p>
              </div>
              <div className="flex-1 flex flex-col justify-center align-middle text-center">
                <p className="text-xs">{t('label_Available_Credit')}</p>
                <p className="text-32">{billingDetails?.availableCredit}</p>
              </div>

              <div className="flex-1 flex flex-col justify-center align-middle text-center">
                <p className="text-xs">{t('label_Credit_Limit')}</p>
                <p className="text-32">{billingDetails?.creditLimit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center  mb-9   bg-white gap-10 mt-4">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <Table
            data={currentItems as []}
            columns={columns}
            sortable
            onCellClick={viewDocumentDetails}
            isClickableUnderLine
            clickableColumns={['statements']}
            modifyCssColumns={['statements']}
            customColumnsStyle="inline-flex"
          />
        </div>
      </div>
      <Pagination
        perPageList={addressBookTablePageList}
        currentPageSize={pageSize?.toString() || '5'}
        getSelectedPageSize={handleSelectingPageSize}
        totalItems={10}
        itemsPerPage={pageSize || 25}
        isPaging
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default memo(BillingStatements);

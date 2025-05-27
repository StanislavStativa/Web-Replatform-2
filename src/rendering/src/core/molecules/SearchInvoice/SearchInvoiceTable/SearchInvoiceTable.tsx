import React, { memo, useState } from 'react';
import { ITypesSearchInTableData, ITypesSearchInvoiceTable } from './SearchInvoiceTable.type';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import Table from '@/core/atoms/Table/Table';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
const SearchInvoiceTable = ({
  searchList,
  getCheckedCol,
  selectedColumns,
  openPayInvoice,
  downloadFile,
  amountAssigned,
  reftech,
}: ITypesSearchInvoiceTable) => {
  const { t } = useI18n();
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [isUnSelectAll, setIsUnSelectAll] = useState<boolean>(false);

  const columns: ITypesTable<ITypesSearchInTableData>['columns'] = [
    { header: t('label_Document_Number'), accessor: 'invoice' },
    { header: t('label_Order_Number'), accessor: 'orderNumber' },
    { header: t('label_Document_Type'), accessor: 'documentType' },
    { header: t('label_Date'), accessor: 'date' },
    { header: t('label_Sale_Total'), accessor: 'saleTotal' },
    { header: t('Invoice_Paid'), accessor: 'paid' },
    { header: t('Invoice_Open'), accessor: 'open' },
    { header: t('Invoice_DueDate'), accessor: 'dueDate' },
    { header: t('label_Po_Number'), accessor: 'poNumber' },
    { header: t('Invoice_In'), accessor: 'in' },
    // { header: t('label_Customer'), accessor: 'customer' },
  ];

  const viewDocumentDetails = (id: string, column: string) => {
    //Need column as in otherwise function will be called twice
    if (column === 'in') {
      downloadFile(id);
    } else if (column === 'invoice') {
      downloadFile(id);
    }
  };

  const unSelectAll = () => {
    setIsUnSelectAll(true);
    setIsSelectAll(false);
    setTimeout(() => {
      setIsUnSelectAll(false);
    }, 2000);
  };
  const selectAll = () => {
    setIsUnSelectAll(false);
    setIsSelectAll(true);
    setTimeout(() => {
      setIsSelectAll(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 justify-center  mb-9   bg-white gap-10">
      <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
        <Table
          data={searchList as []}
          columns={columns}
          // modifyCssColumns={['open']}
          // customColumnsStyle={'text-light-slate-red'}
          onCellClick={viewDocumentDetails}
          isClickableUnderLine
          clickableColumns={['invoice', 'in']}
          isCheckbox
          isSelectAll={isSelectAll}
          isUnSelectAll={isUnSelectAll}
          checkboxLabel="Pay"
          onSelectedRowsChange={getCheckedCol}
          filesColumns={['in']}
          fieldCss="text-xs w-24 md:w-auto mr-16 md:mr-0"
          isMobileCheckboxLabel={t('label_pay_invoice')}
        />
        <div className="md:hidden w-full flex border-t border-border-gray pt-5 ">
          <div className="w-full flex flex-col md:flex-row gap-4 md:gap-7 md:items-center justify-start md:justify-end">
            {/* <div className="flex flex-row gap-7 items-center ">
              <p className="text-xs font-medium">{t('Invoice_TotalOpenAmount')}</p>{' '}
              <p className="text-xs font-bold">{`$${totalOpenAmount?.toFixed(2)}`}</p>
            </div> */}
            <div className="flex flex-row gap-7 items-center">
              <p className="text-xs font-medium">{t('Invoice_AmountAssigned')}</p>{' '}
              {selectedColumns?.length !== 0 && (
                <p className="text-xs font-bold">{`$${amountAssigned?.toFixed(2)}`}</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-90p flex justify-left gap-2 mt-2 justify-between flex-col md:flex-row mx-auto">
          <div className="w-full md:w-auto flex justify-left gap-4">
            <Button
              size={SIZE.SMALL}
              variant={ButtonVariant.OUTLINE}
              isTypeSubmit={false}
              onClick={selectAll}
            >
              Select All
            </Button>
            <Button
              size={SIZE.SMALL}
              variant={ButtonVariant.OUTLINE}
              isTypeSubmit={false}
              onClick={unSelectAll}
            >
              DeSelect All
            </Button>
            <Button
              size={SIZE.SMALL}
              variant={ButtonVariant.OUTLINE}
              isTypeSubmit={false}
              onClick={reftech}
            >
              Refresh
            </Button>
          </div>
          <div className="w-auto">
            <Button
              size={SIZE.SMALL}
              variant={ButtonVariant.BLACK}
              isTypeSubmit={false}
              disabled={selectedColumns?.length === 0}
              onClick={openPayInvoice}
            >
              {t('Invoice_Continue')}
            </Button>
          </div>
        </div>
        <div className="hidden w-full md:flex border-t border-border-gray pt-5 ">
          <div className="w-full flex flex-col md:flex-row gap-4 md:gap-7 md:items-center justify-start md:justify-end">
            {/* <div className="flex flex-row gap-7 items-center ">
              <p className="text-xs font-medium">{t('Invoice_TotalOpenAmount')}</p>{' '}
              <p className="text-xs font-bold">{`$${totalOpenAmount?.toFixed(2)}`}</p>
            </div> */}
            <div className="flex flex-row gap-7 items-center">
              <p className="text-xs font-medium">{t('Invoice_AmountAssigned')}</p>{' '}
              {selectedColumns?.length !== 0 && (
                <p className="text-xs font-bold">{`$${amountAssigned?.toFixed(2)}`}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SearchInvoiceTable);

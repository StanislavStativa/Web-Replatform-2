import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { ITypesPagination } from './Pagination.type';
import { useI18n } from 'next-localization';
import CustomSelect from '../Select/Select';
import { BsFiletypeXlsx } from 'react-icons/bs';
import { cn } from '@/utils/cn';
const Pagination = ({
  perPageList,
  currentPageSize,
  getSelectedPageSize,
  totalItems,
  itemsPerPage,
  isPaging = false,
  onPageChange,
  isDownload = false,
  onDownload,
  selectClass,
  isDownloadDisabled = false,
}: ITypesPagination) => {
  const { t } = useI18n();
  const [selectedPageSize, setSelectedPageSize] = useState<string>(currentPageSize || '');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  // Effect to recalculate pageCount whenever totalItems, itemsPerPage, or selectedPageSize changes
  useEffect(() => {
    const numericPageSize = Number(selectedPageSize);
    const validPageSize = numericPageSize > 0 ? numericPageSize : 10000;
    if (totalItems && validPageSize) {
      setPageCount(Math.ceil(totalItems / validPageSize));
    } else {
      setPageCount(0);
    }
  }, [totalItems, selectedPageSize, itemsPerPage]);

  const onSelectingPageSize = (pageSize: string) => {
    const numericPageSize = Number(pageSize);
    setSelectedPageSize(pageSize);
    getSelectedPageSize(numericPageSize > 0 ? numericPageSize : undefined);
    setCurrentPage(0); // Reset to first page when page size changes
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
    if (onPageChange) onPageChange(data.selected);
  };
  const handleDownloadClick = () => {
    if (onDownload) onDownload();
  };

  return (
    <div className="flex flex-col md:flex-row align-middle justify-between bg-dark-gray rounded-md py-3 pb-3 px-4 pr-4 gap-6 md:gap-0">
      {isPaging && pageCount > 1 && (
        <div className="flex-1 flex align-middle items-center">
          <div className="w-full flex flex-row gap-2">
            <p className="text-white text-xs font-medium">{t('label_Page')}</p>
            <ReactPaginate
              pageCount={pageCount}
              pageRangeDisplayed={4}
              marginPagesDisplayed={1}
              onPageChange={handlePageClick}
              containerClassName="flex flex-row gap-2 text-white text-xs font-medium"
              pageClassName="text-white text-xs font-medium"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="underline"
              previousLabel={currentPage === 0 ? '' : '<'}
              nextLabel={pageCount >= 2 ? '>' : ''}
              breakLabel="..."
              initialPage={currentPage}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          'flex-1 flex align-middle items-center justify-between md:justify-end  gap-2 gap-y-6',
          selectClass
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <p className="text-xs font-medium text-white">{t('AddressBook_ItemsPerPage')}</p>
          <div className="max-w-24">
            <CustomSelect
              className="py-1 md:py-0 px-2 min-w-24"
              options={perPageList}
              selected={selectedPageSize}
              onSelect={onSelectingPageSize}
            />
          </div>
        </div>

        {isDownload === true && (
          <div className="ml-6">
            <button
              disabled={isDownloadDisabled}
              className={`text-white flex flex-row gap-2 opc ${isDownloadDisabled ? 'opacity-35' : ''}`}
              onClick={handleDownloadClick}
            >
              <BsFiletypeXlsx size={20} />{' '}
              <p className="underline text-xs">{t('label_XLS_Download')}</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;

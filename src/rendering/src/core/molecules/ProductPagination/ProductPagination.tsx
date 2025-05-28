import React, { useCallback, useEffect, useRef } from 'react';
import Button from '@/core/atoms/Button/Button';
import { ProductPaginationProps } from './ProductPagination.type';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { PiCaretLeftThin, PiCaretRightThin } from 'react-icons/pi';
import { useAtom } from 'jotai';
import { activePage, viewAllProduct } from '../ProductListingFilters/ProductFiltersState';
import { cn } from '@/utils/cn';
import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import { useProductUrlParam } from '@/hooks/useProductProps';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';

const ProductPagination = (props: ProductPaginationProps) => {
  const { pagination } = props;
  const deviceType = useDeviceType();
  const isMobile: boolean = deviceType === DeviceType.Mobile;
  const [currentPage, setCurrentPage] = useAtom(activePage);
  const [viewAllFlag, setViewAllProduct] = useAtom(viewAllProduct);
  const { t } = useI18n();

  const observer = useRef<IntersectionObserver>();
  const isEmpty = pagination?.content?.product?.value?.length === 0;
  const router = useRouter();
  const pathName = useProductUrlParam();
  const pageSize = props?.rendering?.fields?.DefaultItemsPerPageDesktop?.value ?? '0';
  const mobilePageSize = props?.rendering?.fields?.DefaultItemsPerPageMobile?.value ?? '0';

  const getPageNumbers = () => {
    const pageNumbers: (string | number)[] = [];
    if (pagination?.total_page) {
      if (viewAllFlag) {
        pageNumbers?.push(1);
        return pageNumbers;
      }

      // Scenario : If total pages are 4
      else if (pagination?.total_page === 4) {
        for (let i = 1; i <= 4 && i <= pagination?.total_page; i++) {
          pageNumbers?.push(i);
        }
        return pageNumbers;
      }
      // Scenario : If total pages are not equal to 4
      else {
        // Scenario 1: When the first 3 pages are displayed
        if (currentPage && currentPage <= 3) {
          for (let i = 1; i <= 3 && i <= pagination?.total_page; i++) {
            pageNumbers?.push(i);
          }
          if (pagination?.total_page > 4) {
            pageNumbers?.push('...');
            pageNumbers?.push(pagination?.total_page);
          }
        }
        // Scenario 2: When the last 3 pages are displayed
        else if (currentPage && currentPage >= pagination?.total_page - 2) {
          pageNumbers?.push(1);
          if (pagination?.total_page > 4) {
            pageNumbers?.push('...');
          }
          for (let i = pagination?.total_page - 2; i <= pagination?.total_page; i++) {
            pageNumbers?.push(i);
          }
        }
        // Scenario 3: When pages except the first 3 or last 3 are displayed
        else {
          pageNumbers?.push(1);
          pageNumbers?.push('...');
          if (currentPage) pageNumbers?.push(currentPage - 1);
          if (currentPage) pageNumbers?.push(currentPage);
          if (currentPage) pageNumbers?.push(currentPage + 1);
          pageNumbers?.push('...');
          pageNumbers?.push(pagination?.total_page);
        }
      }
    }
    return pageNumbers;
  };

  const pageLength = getPageNumbers()?.filter((pageNumber) => pageNumber === '...')?.length;
  const handlePageChange = (page?: number) => {
    window.scrollTo(0, 0);
    const baseUrl: string = pathName ?? '';
    delete router.query.path;
    if (page) {
      setCurrentPage(page);

      if (router.query) {
        const newQuery = {
          ...router.query,
          pageNumber: page,
          pageSize: pageSize,
        };
        router.push({
          pathname: baseUrl,
          query: newQuery,
        });
      }
    } else {
      const newQuery = {
        ...router.query,
        pageNumber: '1',
        pageSize: 'all',
      };
      router.push({
        pathname: baseUrl,
        query: newQuery,
      });
    }
  };

  useEffect(() => {
    const queryPageNumber = router.query['pageNumber'];
    const queryPageSize = router.query['pageSize'];
    if (queryPageNumber) setCurrentPage(Number(queryPageNumber));
    else setCurrentPage(1);
    if (queryPageSize === 'all') setViewAllProduct(true);
    else setViewAllProduct(false);
  }, [router.query]);

  const renderPageNumbers = () => {
    const pageNumbers = getPageNumbers();
    return pageNumbers?.map((pageNumber, index) => {
      if (typeof pageNumber === 'string') {
        return (
          <span
            key={pageNumber}
            className="flex text-base md:text-xl font-light text-center items-end pt-1 max-w-80 bg-none w-10 h-10 justify-center"
          >
            ...
          </span>
        );
      }
      const isActive = pageNumber === currentPage;
      const isFirstThree = pageNumber <= 3;
      const isLastThree = pageNumber >= pagination?.total_page - 2;
      if (isFirstThree || isLastThree || (currentPage && Math.abs(pageNumber - currentPage) <= 1)) {
        return (
          <Button
            key={pageNumber + index}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            variant={ButtonVariant.PRIMARY}
            className={cn(
              'flex text-xl font-latoLight text-center items-center pt-1 bg-none justify-center mt-2.5 text-slate-gray-500 w-9 h-9 px-0 md:px-6',
              {
                'font-latoRegular shadow-none drop-shadow-none transition-none px-0 pb-0 font-bold text-black md:h-12 md:w-12 md:mt-0 mt-1.5 pt-0 bg-tonal-gray rounded-full ':
                  isActive,
              }
            )}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      }
      return null;
    });
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (viewAllFlag) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting) {
            props?.fetchNextPage();
          }
        });
        if (node) observer?.current?.observe(node);
      }
    },
    [props?.fetchNextPage, viewAllFlag, props?.hasNextPage, props?.isLoading]
  );

  const ButtonStyle: string =
    'flex font-latoLight text-center items-center pt-1 md:max-w-80 bg-none text-slate-gray-500 hover:bg-transparent hover:shadow-none hover:drop-shadow-none hover:transition-none font-latoLight px-0 pb-0 text-base lg:text-xl md:justify-end';

  return (
    <div
      className={cn(
        'container mx-auto md:px-10 w-full flex md:flex-row flex-wrap items-center my-20 px-7',
        'justify-between',
        { hidden: isEmpty },
        pagination?.total_item <= Number(pageSize) && !isMobile && 'hidden',
        pagination?.total_item <= Number(mobilePageSize) && isMobile && 'hidden'
      )}
      ref={lastElementRef}
    >
      {!props?.isLoading && (
        <div
          className={cn(
            'flex-grow flex  md:flex-row justify-center items-center ',
            {
              'flex-col ': pageLength && pageLength > 1,
            },
            {
              'md:pl-40':
                (currentPage === 1 || currentPage === pagination?.total_page) && pageLength === 0,
            },
            {
              'md:pl-56': pageLength && pageLength >= 1,
            }
          )}
        >
          <Button
            variant={ButtonVariant.PRIMARY}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            className={`${currentPage === 1 || pagination?.total_page === 4 ? 'hidden' : ButtonStyle} max-w-4`}
            onClick={() => currentPage && handlePageChange(currentPage - 1)}
          >
            <PiCaretLeftThin size={20} />
            <span className="hidden md:block">{t('Tag_Previous')}</span>
          </Button>
          <div className="flex mx-5">{renderPageNumbers()}</div>
          <Button
            variant={ButtonVariant.PRIMARY}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            className={`${currentPage === pagination?.total_page || pagination?.total_page === 4 || viewAllFlag ? 'hidden' : ButtonStyle} max-w-4`}
            onClick={() => currentPage && handlePageChange(currentPage + 1)}
          >
            <span className="hidden md:block">{t('Tag_Next')}</span>
            <PiCaretRightThin size={20} />
          </Button>
        </div>
      )}

      <button
        className={cn(
          ButtonStyle,
          'ml-auto',
          'hidden md:block',
          {
            'md:hidden': viewAllFlag,
          },
          props?.params?.IsCTATextInCaps && 'uppercase'
        )}
        onClick={() => {
          setViewAllProduct(true);
          handlePageChange();
        }}
      >
        {t('Tag_ViewAll')} ({props?.isLoading ? 0 : pagination?.total_item ?? 0})
      </button>
    </div>
  );
};

export default ProductPagination;

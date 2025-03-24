import { useI18n } from 'next-localization';
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { ProductSortField, SortFilterProps } from './ProductFilter.type';
import { ProductSortState } from '../ProductListing/ProductListing.type';
import { useAtom } from 'jotai';
import { activePage, sortValue } from './ProductFiltersState';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import { createPortal } from 'react-dom';
import useNavigationClickOutside from '../SecondaryNavigation/useNavigationClickOutside';
import { useRouter } from 'next/router';
import { useProductUrlParam } from '@/hooks/useProductProps';

const SortFilter = (props: SortFilterProps) => {
  const { t } = useI18n();
  const isDesktop: boolean = useDeviceType() === DeviceType.Desktop;
  const isTablet: boolean = useDeviceType() === DeviceType.Tablet;
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;
  const [currentPage] = useAtom(activePage);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathName = useProductUrlParam();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const [sortItemData, setSortInfo] = useAtom(sortValue);

  const handleSort = (item: ProductSortField) => {
    const baseUrl: string = pathName ?? '';
    const availableSort: ProductSortState | undefined = Object.values(sortItemData).find(
      (sortItem: ProductSortState) => {
        return sortItem.name === item.name;
      }
    );
    if (availableSort) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    setSortInfo([{ name: item.name, order: item.order }]);

    if (router.query) {
      delete router.query.path;

      const newQuery = {
        pageNumber: currentPage,
        pageSize: props.pageSize,
        ...router.query,
        sortby: item?.name,
        sortorder: item.order,
      };

      router.push({
        pathname: baseUrl,
        query: newQuery,
      });
    }
  };

  const Wrapper = () => {
    return (
      <ul
        className={cn('py-7', {
          ' absolute right-16 mt-4 z-10 pt-6 bg-white w-80 text-left shadow-filterShadow py-5  ':
            isDesktop || isTablet,
        })}
      >
        {props.sortData?.choices?.map((item: ProductSortField, index: number) => {
          return (
            <li
              key={`${item}_${index}`}
              className="border border-white hover:bg-dark-gray hover:border-black hover:font-bold group"
              onClick={() => handleSort(item)}
            >
              <div
                className={cn(
                  'list-none mx-9 py-3.5 md:py-1 text-base md:text-xl font-light hover:border-0 group-hover:border-0 hover:font-normal border-b cursor-pointer group-hover:text-white font-latoLight',
                  {
                    'border-t hover:border-dark-gray': index === 0,
                  }
                )}
              >
                {item.label}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const onOutsideClick = () => {
    setIsOpen(false);
  };
  const sortRef = useNavigationClickOutside(onOutsideClick);

  return (
    <div className="relative order-2" ref={sortRef}>
      <button
        className={cn(
          'w-full md:w-auto py-3 px-3.5 font-light text-xl text-center border-dark-gray border tracking-widest font-latoLight'
        )}
        onClick={() => handleClick()}
      >
        {t('CTA_Text_Sort')}
      </button>
      {(isDesktop || isTablet) && isOpen && <Wrapper />}
      {isMobile && (
        <div
          className={cn(
            'z-50 fixed top-13 -right-65 md:top-16  bg-white h-screen overflow-y-auto w-65 transition-all duration-500 ease-in-out shadow-filterShadow shadow-search-gray',
            { 'right-0': isOpen }
          )}
        >
          <Wrapper />
          {isOpen && (
            <div onClick={() => setIsOpen(false)}>
              {createPortal(
                <div className="bg-black opacity-50 fixed top-0 bottom-0 w-full h-screen " />,
                document.body
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SortFilter;

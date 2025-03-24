import { useI18n } from 'next-localization';
import React, { useEffect } from 'react';
import Filter from './Filter';
import { RxCross1 } from 'react-icons/rx';
import { ProductFiltersPageProps, ProductSortState } from '../ProductListing/ProductListing.type';
import { useAtom } from 'jotai';
import SortFilter from './SortFilter';
import { cn } from '@/utils/cn';
import {
  selectedFilter,
  filterValue,
  openFacet,
  filterOpen,
  activePage,
  viewAllProduct,
  sortValue,
} from './ProductFiltersState';
import { ProductFilterFacetValue, SelectedFilterState } from './ProductFilter.type';
import { useDeviceType, DeviceType } from '@/hooks/useDeviceType';
import { createPortal } from 'react-dom';
import useNavigationClickOutside from '../SecondaryNavigation/useNavigationClickOutside';
import { useProductUrlParam } from '@/hooks/useProductProps';
import { useRouter } from 'next/router';

const ProductListingFilters = (props: ProductFiltersPageProps) => {
  const { facet, sort, facet_names } = props?.filters || [];
  const { t } = useI18n();

  const [filterData, setFilterData] = useAtom<SelectedFilterState[]>(selectedFilter);
  const [filterInfo, setFilterInfo] = useAtom(filterValue);
  const [isFilterOpen, setIsFilterOpen] = useAtom(filterOpen);
  const [, setSortPayload] = useAtom<ProductSortState[]>(sortValue);
  const [currentPage, setCurrentPage] = useAtom(activePage);
  const [, setOpenFacetName] = useAtom(openFacet);
  const isDesktop: boolean = useDeviceType() === DeviceType.Desktop;
  const isTablet: boolean = useDeviceType() === DeviceType.Tablet;
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;
  const [, setViewAllProduct] = useAtom(viewAllProduct);
  const path = useProductUrlParam();
  const router = useRouter();
  const pageSize = props?.rendering?.fields?.DefaultItemsPerPageDesktop?.value;

  const handleClick = () => {
    setIsFilterOpen(!isFilterOpen);
    !isFilterOpen && setOpenFacetName('');
  };

  useEffect(() => {
    isMobile && setIsFilterOpen(false);
  }, [isMobile]);

  const deleteFilter = (data: SelectedFilterState, id: string) => {
    const baseUrl: string = path ?? '';
    setFilterData(filterData?.filter((item) => item?.text !== data?.text));
    const updatedFilter = { ...filterInfo };
    const facetData = updatedFilter[data?.facet_name];

    if (facetData) {
      facetData.value = facetData?.value?.filter((item) => item !== id);

      if (facetData?.value?.length === 0) {
        delete updatedFilter[data?.facet_name];
      }
    }
    if (currentPage === 1) {
      const baseUrl: string = path ?? '';
      Object.keys(updatedFilter).length === 0 &&
        router.push(`${baseUrl}?pageNumber=1&pageSize=${pageSize}`);
      setViewAllProduct(false);
    }
    if (Object.keys(router.query).length) {
      delete router.query.path;
      const facetKey = `facet_${data.facet_name}`;
      const facetValue = router.query[facetKey];

      if (Array.isArray(facetValue)) {
        router.query[facetKey] = facetValue.filter((item) => item !== id);
      } else {
        delete router.query[facetKey];
      }
      const newQuery = {
        pageNumber: currentPage,
        ...router.query,
      };
      router.push({
        pathname: baseUrl,
        query: newQuery,
      });
    }
  };

  const checkedFilter = (facet_name: string, data: string, id: string) => {
    const baseUrl: string = path ?? '';
    const existingDataObj = filterInfo?.hasOwnProperty(data);
    const updatedObj = { ...filterInfo[data] };

    const existingFilterData = filterData?.find(
      (item: SelectedFilterState) => item?.text === facet_name
    );

    existingFilterData
      ? setFilterData(filterData?.filter((item) => item?.text !== facet_name))
      : setFilterData([...filterData, { text: facet_name, id: id, facet_name: data }]);

    if (existingDataObj) {
      // If the data key already exists, update the value array

      if (!updatedObj?.value?.includes(id)) {
        if (Array.isArray(updatedObj?.value)) {
          updatedObj?.value?.push(id);
        } else {
          updatedObj.value = [updatedObj?.value, id];
        }
      } else {
        updatedObj.value = updatedObj?.value?.filter((item: string) => item !== id);
      }

      setFilterInfo({ ...filterInfo, [data]: updatedObj });
      setCurrentPage(1);
    } else {
      // If the data key doesn't exist, add a new object
      setFilterInfo({ ...filterInfo, [data]: { value: [id] } });
      setCurrentPage(1);
    }
    if (router.query) {
      delete router.query.path;

      const newQuery = {
        ...router.query,
        pageNumber: '1',
        pageSize: pageSize,
        [`facet_${data}`]: updatedObj?.value ?? [id],
      };

      router.push({
        pathname: baseUrl,
        query: newQuery,
      });
    }
  };

  const handleClear = () => {
    const baseUrl: string = path ?? '';

    setFilterData([]);
    setFilterInfo({});
    setViewAllProduct(false);
    setSortPayload([]);
    setCurrentPage(1);
    router.push(`${baseUrl}?pageNumber=1&pageSize=${pageSize}`);
  };

  const onOutsideClick = () => {
    setOpenFacetName('');
  };
  const filterRef = useNavigationClickOutside(onOutsideClick);

  const getFilter = () => {
    const newFilterData: SelectedFilterState[] = [];

    Object.keys(router.query).forEach((key) => {
      if (key.startsWith('facet_') && facet) {
        const facetName = key.replace('facet_', '');
        const facetValues = Array.isArray(router.query[key])
          ? router.query[key]
          : [router.query[key]];

        Array.isArray(facetValues) &&
          facetValues?.forEach((value) => {
            const facetItem = facet[facetName]?.value?.find(
              (item: ProductFilterFacetValue) => item.id === value
            );
            if (facetItem) {
              newFilterData.push({
                text: facetItem.text,
                id: facetItem.id,
                facet_name: facetName,
              });
            }
          });
      }
    });

    if (
      Object.keys(router.query).some((key) => key.startsWith('facet_')) &&
      newFilterData.length === 0
    ) {
      return filterData;
    }
    return newFilterData;
  };

  useEffect(() => {
    const newFilterData = getFilter();
    setFilterData(newFilterData);
  }, [router.query, props.isFilter]);

  return (
    <div className="mt-10 mb-5 relative md:px-10">
      <div className="z-10">
        <div className="grid grid-cols-2 md:flex md:justify-between mt-10">
          {/* button of filter */}
          <div className="flex  order-1">
            <button
              className={cn(
                'w-full md:w-auto py-3 px-3.5 font-light text-xl text-center border-dark-gray border tracking-widest font-latoLight',
                {
                  'bg-dark-gray text-white': isFilterOpen,
                },
                props?.params?.IsCTATextInCaps && 'uppercase'
              )}
              onClick={() => handleClick()}
            >
              {t('CTA_Text_Filter')}
            </button>
            <div className="hidden md:flex md:w-4/5 flex-wrap absolute left-36 mt-5">
              {filterData?.map((data: SelectedFilterState, index: number) => {
                return (
                  <button
                    className="flex text-center bg-zinc-100 gap-1 items-center px-2 py-1 ml-5 mb-1"
                    key={`${data}_${index}`}
                    onClick={() => deleteFilter(data, data?.id)}
                  >
                    <RxCross1 className="h-3.5 w-3.5 my-1" />
                    <div className="font-normal text-base text-left tracking-widest">
                      {data?.text}
                    </div>
                  </button>
                );
              })}
              {filterData?.length > 0 && (
                <button
                  className="mr-5 ml-5 text-dark-gray font-normal text-base underline underline-offset text-left"
                  onClick={() => handleClear()}
                >
                  {t('Tag_ClearAll')}
                </button>
              )}
            </div>
          </div>
          <SortFilter sortData={sort} pageSize={pageSize} />
        </div>
        {(isDesktop || isTablet) && isFilterOpen && (
          <div className={cn('flex mr-20 flex-wrap mt-7 ')} ref={filterRef}>
            {facet_names?.map((facet_name: string, index: number) => {
              return (
                <Filter
                  key={`${facet_name}_${index}`}
                  facet={facet}
                  facet_name={facet_name}
                  onCheckedFilter={checkedFilter}
                />
              );
            })}
          </div>
        )}
        {isMobile && (
          <div
            className={cn(
              'z-50 fixed top-13 -left-60 bg-white h-full overflow-y-scroll w-60 pb-20 mr-0 mt-0 transition-all duration-500 ease-in-out shadow-filterShadow shadow-search-gray',
              {
                'left-0 ': isFilterOpen,
              }
            )}
          >
            {facet_names?.map((facet_name: string, index: number) => {
              return (
                <Filter
                  key={`${facet_name}_${index}`}
                  facet={facet}
                  facet_name={facet_name}
                  onCheckedFilter={checkedFilter}
                />
              );
            })}

            {isFilterOpen && (
              <>
                <button
                  className={cn(
                    'block md:hidden text-center ml-6 bg-tonal-gray rounded-md py-3 px-6',
                    props?.params?.IsCTATextInCaps && 'uppercase'
                  )}
                  onClick={() => {
                    setIsFilterOpen(false);
                  }}
                >
                  {t('Tag_ShowResults')}
                </button>
                <div
                  className="hidden group-hover:visible"
                  onClick={() => {
                    setIsFilterOpen(false);
                  }}
                >
                  {createPortal(
                    <div className="bg-black opacity-50 fixed top-0 bottom-0 w-full h-full" />,
                    document.body
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductListingFilters;

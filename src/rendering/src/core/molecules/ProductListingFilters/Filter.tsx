import React from 'react';
import { cn } from '@/utils/cn';
import { PiCaretDownBold, PiCaretLeft, PiCaretRightLight, PiCaretUpBold } from 'react-icons/pi';
import { RxCross1 } from 'react-icons/rx';
import { useI18n } from 'next-localization';
import {
  ProductFilterFacetValue,
  ProductFilterProps,
  SelectedFilterState,
} from './ProductFilter.type';
import { useAtom } from 'jotai';
import { filterOpen, filterValue, openFacet, selectedFilter } from './ProductFiltersState';
import { useDeviceType, DeviceType } from '@/hooks/useDeviceType';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useProductUrlParam } from '@/hooks/useProductProps';
import router from 'next/router';

const Filter: React.FC<ProductFilterProps> = (props) => {
  const { facet_name, facet, onCheckedFilter } = props;
  const [filterInfo, setFilterInfo] = useAtom(filterValue);
  const [selectedFilterisOpen, setSelectedFilterisOpen] = useAtom(selectedFilter);
  const [openFacetName, setOpenFacetName] = useAtom(openFacet);
  const { t } = useI18n();
  const handleFilterClick = () => {
    if (openFacetName === facet_name) {
      setOpenFacetName(''); // Close the dropdown if it's already open
    } else {
      setOpenFacetName(facet_name); // Open the dropdown for the clicked facet
    }
  };

  const isDesktop: boolean = useDeviceType() === DeviceType.Desktop;
  const isTablet: boolean = useDeviceType() === DeviceType.Tablet;
  const path = useProductUrlParam();

  const handleClear = () => {
    const valuesToRemove = facet[facet_name]?.value?.map((item) => item?.text);
    const filteredSelectedFilterisOpen = selectedFilterisOpen?.filter(
      (item: SelectedFilterState) => !valuesToRemove?.includes(item?.text)
    );

    setSelectedFilterisOpen(filteredSelectedFilterisOpen);
    const updatedFilter = { ...filterInfo };
    delete updatedFilter[facet_name];
    setFilterInfo(updatedFilter);
    const baseUrl: string = path ?? '';
    delete router.query.path;
    delete router.query[`facet_${facet_name}`];

    router.push({
      pathname: baseUrl,
      query: router.query,
    });
  };
  const handlecheckefFilter = (facetItem: ProductFilterFacetValue) => {
    const facetText = facet_name.includes('price')
      ? formatPriceRange(facetItem.text)
      : facetItem?.text;
    onCheckedFilter(facetText, facet_name, facetItem?.id);
    setOpenFacetName('');
  };
  const isAnyItemSelected = filterInfo[facet_name]?.value?.length > 0;

  const [, setIsFilterOpen] = useAtom(filterOpen);

  const formatPriceRange = (text: string) => {
    return text
      .split('-')
      .map((num) => `$${Number(num).toFixed(2)}`)
      .join(' - ');
  };

  const FilterChild = () => {
    return (
      <>
        <button
          className="hidden md:flex cursor-pointer w-full justify-end z-60"
          onClick={handleFilterClick}
        >
          <RxCross1 className="w-6 h-6 -z-50" />
        </button>
        <button
          className="md:hidden w-full flex justify-between py-3.5 bg-dark-gray text-white px-6"
          onClick={() => setOpenFacetName('')}
        >
          <PiCaretLeft size={30} color="white" />
          {facet[facet_name]?.display_name?.toUpperCase()}
        </button>
        {facet[facet_name]?.value?.map((facetItem: ProductFilterFacetValue, index: number) => {
          return (
            <button
              key={facetItem?.id + index}
              className={`mt-4 flex flex-row gap-5 md:mb-1 group px-6 md:px-0 mb-5 font-latoLight group-hover:text-dark-gray `}
              onClick={() => handlecheckefFilter(facetItem)}
            >
              <input
                type="checkbox"
                name={facetItem?.text}
                checked={filterInfo[facet_name]?.value?.includes(facetItem?.id)}
                className={`flex h-5 w-5 appearance-none rounded-sm border border-dark-gray font-normal text-base checked:bg-dark-gray group-hover:border-2 ${
                  filterInfo[facet_name]?.value?.includes(facetItem?.id)
                    ? 'border-2 border-dark-gray '
                    : ''
                }`}
                readOnly
              />
              <label
                htmlFor={facetItem?.text}
                className={`flex gap-1 md:font-light text-lg leading-5 text-left group-hover:font-bold ${
                  filterInfo[facet_name]?.value?.includes(facetItem?.id) && 'font-bold'
                }`}
              >
                {facet_name.includes('price') ? formatPriceRange(facetItem.text) : facetItem?.text}
                <span>({facetItem?.count})</span>
              </label>
            </button>
          );
        })}
        <button
          className="w-fit mt-4 px-6 md:px-0 mb-5 pr-31 text-dark-gray font-normal text-base hover:font-bold hover:text-base underline underline-offset text-left"
          onClick={() => handleClear()}
        >
          {t('Tag_ClearAll')}
        </button>
        <Button
          className="block md:hidden text-center ml-6 mt-7 rounded-md py-3 px-6 border-tonal-gray"
          variant={ButtonVariant.OUTLINE}
          onClick={() => {
            setOpenFacetName('');
            setIsFilterOpen(false);
          }}
        >
          {t('Tag_ShowResults')}
        </Button>
      </>
    );
  };

  return (
    <div className="flex md:justify-between items-center relative w-full md:w-auto">
      {/* {display_name && ( */}
      <button
        className={cn(
          'flex w-full justify-between py-3 px-8.5 md:p-0 uppercase md:font-latoRegular font-latoLight md:pr-5 md:mb-5 md:gap-3 h-11 mb-1.5',
          {
            'gap-3 mb-5 list-none flex-wrap uppercase text-base hover:font-bold font-normal md:pr-5 hover:tracking-wider':
              isDesktop,
          },
          {
            'font-bold bg-tonal-gray ': !isDesktop && isAnyItemSelected,
          }
        )}
        onClick={handleFilterClick}
      >
        {facet[facet_name]?.display_name}
        {/* icon with list */}
        {isDesktop || isTablet ? (
          <div className="rounded-full bg-tonal-gray relative -z-10 h-fit ">
            {openFacetName === facet_name ? (
              <PiCaretUpBold size={20} />
            ) : (
              <PiCaretDownBold size={20} />
            )}
          </div>
        ) : (
          <PiCaretRightLight size={30} />
        )}
      </button>
      {(isDesktop || isTablet) && openFacetName === facet_name ? (
        <div
          className={cn(
            'mt-2.5 absolute left-0 top-5 w-0 min-w-80 max-h-488 overflow-y-scroll px-7 py-5 shadow-filterShadow bg-white z-10',
            {
              'flex flex-col w-80': openFacetName === facet_name,
            }
          )}
        >
          <FilterChild />
        </div>
      ) : (
        <div
          className={cn(
            'md:hidden z-50 fixed top-13 -left-60 bg-white h-full overflow-y-auto w-60 pb-20 transition-all duration-500 ease-in-out shadow-filterShadow shadow-search-gray',
            { 'left-0': openFacetName === facet_name }
          )}
        >
          <FilterChild />
        </div>
      )}
    </div>
  );
};
export default Filter;

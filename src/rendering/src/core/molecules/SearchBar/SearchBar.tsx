import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { DeviceType, useDeviceType, useImprovedDeviceType } from '@/hooks/useDeviceType';
import { type SearchBarProps } from '../Header/Header.types';
import { atom, useAtom } from 'jotai';
import { isSearchBarOpen, searchTerm } from '../Header/Header';
import Close from '@/core/atoms/Icons/Close';
import Image from '@/core/atoms/Image/Image';
import { createPortal } from 'react-dom';
import SearchOverlay from './SearchOverlay';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import ProductAPI, { productStoreId, UUID } from '../ProductListing/ProductAPI';
import { ProductList_PAYLOAD_CONTENT, PRODUCTLIST_SORT } from '@/config';
import { ProductFilterState, ProductSortState } from '../ProductListing/ProductListing.type';
import {
  filterValue,
  sortValue,
  activePage,
  selectedFilter,
} from '../ProductListingFilters/ProductFiltersState';
import { SelectedFilterState } from '../ProductListingFilters/ProductFilter.type';
import useNavigationClickOutside from '../SecondaryNavigation/useNavigationClickOutside';

export const isOverlayOpenState = atom<boolean>(false);

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const router = useRouter();
  const isMobile = useDeviceType() === DeviceType.Mobile;
  const deviceType = useImprovedDeviceType();
  const [searchValue, setSearchValue] = useAtom(searchTerm);
  const [isSearchOpen, setIsSearchOpen] = useAtom(isSearchBarOpen);
  const [, setFilterPayload] = useAtom<ProductFilterState>(filterValue);
  const [, setSortPayload] = useAtom<ProductSortState[]>(sortValue);
  const [, setCurrentPage] = useAtom<number | undefined>(activePage);
  const [isOverlayOpen, setIsOverlayOpen] = useAtom<boolean>(isOverlayOpenState);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [, setFilterData] = useAtom<SelectedFilterState[]>(selectedFilter);
  const id = props?.id;
  const {
    SearchIcon,
    SearchPlaceholderText,
    CancelButtonText,
    RequiredMessage,
    ResultsPageLink,
    KeyphraseMaxSuggestion,
    DiscoverRfkId,
    CategoryMaxSuggestion,
    DefaultItemsPerPageDesktop,
    DefaultItemsPerPageMobile,
  } = props?.fields ?? {};

  const defaultItems = isMobile ? DefaultItemsPerPageMobile : DefaultItemsPerPageDesktop;

  const inputRef = useRef<HTMLInputElement>(null);

  const payload = {
    context: {
      page: { uri: router?.asPath },
      store: { id: productStoreId },
      user: { uuid: UUID },
    },

    widget: { rfkid: DiscoverRfkId?.value },
    n_item: Number(defaultItems?.value),
    page_number: 1,
    sort: { value: [{ name: PRODUCTLIST_SORT, order: 'desc' }], choices: true },
    content: {
      product: {
        field: {
          value: ProductList_PAYLOAD_CONTENT,
        },
      },
    },
    suggestion: {
      keyphrase: { max: Number(KeyphraseMaxSuggestion?.value) },
      category: { max: Number(CategoryMaxSuggestion?.value) },
    },
    query: { keyphrase: { value: [searchValue] } },
  };

  const { data: searchData, refetch } = useQuery({
    queryKey: ['productSearch'],
    queryFn: () => ProductAPI({ pageParam: payload }),
    refetchOnWindowFocus: false,
    enabled: Boolean(searchValue && searchValue !== ''),
  });

  useEffect(() => {
    if (deviceType === DeviceType.Null) {
      return;
    } else if (deviceType === DeviceType.Desktop || deviceType === DeviceType.Tablet) {
      setIsSearchOpen(true);
    }
  }, [deviceType]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event?.preventDefault();
    setSearchValue(event?.target?.value);
    if (event?.target?.value?.length < 3) {
      setIsOverlayOpen(false);
    } else {
      setIsOverlayOpen(true);
    }
  };

  useEffect(() => {
    if (isOverlayOpen) {
      refetch();
    }
  }, [searchValue]);

  const performSearch = () => {
    if (searchValue?.length) {
      setFilterPayload({});
      setSortPayload([]);
      setFilterData([]);
      setCurrentPage(0);
      searchData?.content?.product?.value?.length === 1
        ? router?.push(searchData?.content?.product?.value[0]?.product_url)
        : router?.push(`${ResultsPageLink?.value?.href}?search=${searchValue}`);
      handleClearSearch();
    } else {
      alert(RequiredMessage?.value);
    }
  };
  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      refetch();
      performSearch();
    }
  };

  let isSearch;
  if (searchValue?.length < 3) {
    isSearch = false;
  } else if (
    searchData?.content?.product?.value?.length > 0 ||
    searchData?.suggestion?.keyphrase?.length > 0 ||
    searchData?.suggestion?.category?.length > 0
  ) {
    isSearch = true;
  }

  const handleSearchIconPress = () => {
    switch (isMobile) {
      case true:
        if (isSearchOpen) {
          performSearch();
        } else {
          setIsSearchOpen(true);
        }
        break;
      case false:
        performSearch();
        break;
    }
  };

  const handleClearSearch = () => {
    if (searchValue?.length > 0) {
      setSearchValue('');
      setIsOverlayOpen(false);
    } else {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    inputRef.current?.blur();
  }, [router]);

  const onOutsideClick = () => {
    setSearchValue('');
    setIsOverlayOpen(false);
  };
  const navigationRef = useNavigationClickOutside(onOutsideClick);

  return (
    <section
      className={cn(
        'flex w-full h-full py-2 px-3 gap-3 items-center justify-between min-h-10 md:rounded-md md:border md:border-tonal-gray md:focus:text-dark-gray hover:cursor-text',
        { 'md:border-opacity-100 md:border-dark-gray': isInputFocused }
      )}
      id={id}
      ref={navigationRef}
    >
      <button
        className="flex h-full w-7 md:h-max md:w-max"
        aria-label="search-icon"
        onClick={handleSearchIconPress}
      >
        <Image field={SearchIcon} className="w-4.5 h-4.5" priority={true} />
      </button>

      {isSearchOpen || deviceType === DeviceType.Desktop || deviceType === DeviceType.Tablet ? (
        <div className="flex gap-1 items-center w-full">
          <input
            placeholder={SearchPlaceholderText?.value}
            className={cn(
              'w-full focus-visible:outline-none border text-sm border-dark-gray md:border-none h-10 px-2 md:h-full md:px-0 placeholder:text-dark-gray placeholder:text-sm rounded'
            )}
            value={searchValue}
            onChange={handleChange}
            onKeyDown={handleEnterPress}
            onBlur={() => setIsInputFocused(false)}
            onFocus={() => setIsInputFocused(true)}
            ref={inputRef}
          />
          <div className="absolute top-13 md:top-full md:w-718 mx-auto h-auto left-0 right-0 md:mt-12">
            {isSearch && searchValue && (
              <>
                <div className="max-h-screen overflow-y-auto md:w-718 md:h-auto md:overflow-y-hidden">
                  <SearchOverlay
                    {...searchData}
                    resultPageLink={ResultsPageLink}
                    clearSearch={handleClearSearch}
                    searchValue={searchValue}
                  />
                </div>
                <div onClick={() => handleClearSearch()}>
                  {createPortal(
                    <div className="bg-black opacity-50 fixed top-0 bottom-0 w-full h-full" />,
                    document.body
                  )}
                </div>
              </>
            )}
          </div>
          {isMobile ? (
            <button
              className="flex h-max w-max [&>p]:underline "
              aria-label="clear-search"
              onClick={handleClearSearch}
            >
              <Text tag="p" field={CancelButtonText} className="pl-2" />
            </button>
          ) : (
            <button
              className="flex h-max w-max"
              aria-label="clear-search"
              onClick={handleClearSearch}
            >
              {searchValue?.length ? <Close width={17} height={17} /> : null}
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default SearchBar;

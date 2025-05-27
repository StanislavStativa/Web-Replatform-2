import React, { useEffect, useMemo, useState } from 'react';
import {
  ProductFilterState,
  ProductListingProps,
  ProductPayloadProps,
  ProductSortState,
} from './ProductListing.type';
import ProductAPI, { UUID } from './ProductAPI';
import ProductListing from './ProductListing';
import { useAtom } from 'jotai';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import ProductListingFilters from '../ProductListingFilters/ProductListingFilters';
import {
  activePage,
  filterValue,
  selectedFilter,
  sortValue,
  viewAllProduct,
} from '../ProductListingFilters/ProductFiltersState';
import ProductPagination from '../ProductPagination/ProductPagination';
import { useRouter } from 'next/router';
import ProductSearch from '../ProductSearch/ProductSearch';
import { ProductList_PAYLOAD_CONTENT, PRODUCTLIST_SORT } from '@/config';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import { SelectedFilterState } from '../ProductListingFilters/ProductFilter.type';
import { useProductUrlParam } from '@/hooks/useProductProps';
import { getPriceGroup } from '@/utils/getPriceGroup';
import useLocalStorage from '@/utils/useLocalStorage';

const Products: React.FC<ProductListingProps> = (props) => {
  const { getSessionData, removeSessionData } = useLocalStorage();
  const isFiltersHidden = props?.rendering?.fields?.HideFilters?.value;
  const isPaginationHidden = props?.rendering?.fields?.HidePagination?.value;
  const uid = props?.rendering?.uid;
  const [, setFilterData] = useAtom<SelectedFilterState[]>(selectedFilter);
  const [filterPayload, setFilterPayload] = useAtom<ProductFilterState>(filterValue);
  const [sortPayload, setSortPayload] = useAtom<ProductSortState[]>(sortValue);
  const [currentPage, setCurrentPage] = useAtom<number | undefined>(activePage);
  const [sitecorePath, setSitecorePath] = useState<string | undefined>(undefined);
  const [viewAllFlag] = useAtom<boolean>(viewAllProduct);
  const fromSearch = getSessionData('tts_fromSearch');
  // Added condition for mobile device
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;

  // fetch router, search param and path
  const router = useRouter();
  const searchTerm = router?.query?.search;

  // get default items per page
  const defaultItems = isMobile
    ? props?.rendering?.fields?.DefaultItemsPerPageMobile
    : props?.rendering?.fields?.DefaultItemsPerPageDesktop;
  const uriPath = router.asPath.split('?')[0].toLowerCase();
  const path = useProductUrlParam();

  // fetch data for filters
  const mutation = useMutation({
    mutationFn: (productPayload: ProductPayloadProps) => {
      return ProductAPI({ pageParam: productPayload });
    },
  });

  // Trigger the mutation with the desired payload
  const handleFetchData = (productPayload: ProductPayloadProps) => {
    if (viewAllFlag) {
      return;
    } else {
      mutation.mutate(productPayload);
    }
  };

  const priceGroup = getPriceGroup();

  // initial payaload
  const payload = useMemo(
    () => ({
      context: {
        page: { uri: uriPath },
        store: { id: priceGroup },
        user: { uuid: UUID },
      },
      widget: { rfkid: props?.rendering?.fields?.DiscoverRfkId?.value },
      n_item: Number(defaultItems?.value),
      page_number: 1,
      facet: { all: true },
      sort: { value: [{ name: PRODUCTLIST_SORT, order: 'desc' }], choices: true },
      content: {
        product: {
          field: {
            value: ProductList_PAYLOAD_CONTENT,
          },
        },
      },
    }),
    [uriPath, props, defaultItems, priceGroup]
  );

  const updatedPayload = useMemo(() => {
    if (isFiltersHidden) {
      return payload;
    }
    let updatedPayload: ProductPayloadProps = payload;
    const sortData =
      sortPayload.length > 0 ? sortPayload : [{ name: PRODUCTLIST_SORT, order: 'desc' }];
    const current_number = currentPage && currentPage > 1 ? currentPage : 1;

    updatedPayload = {
      ...payload,
      sort: { value: sortData, choices: true },
      page_number: isPaginationHidden ? 1 : current_number,
    };

    if (Object.keys(filterPayload).length > 0) {
      updatedPayload.filter = filterPayload;
    }

    if (router?.asPath?.includes('Search'.toLocaleLowerCase()) && searchTerm) {
      updatedPayload.query = { keyphrase: { value: [searchTerm.toString()] } };
    }

    return updatedPayload;
  }, [payload, sortPayload, currentPage, filterPayload, router?.asPath, searchTerm, uriPath]);

  // infinite query
  const {
    data: prod,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [`products${uid}`, filterPayload, sortPayload, searchTerm, viewAllFlag, uid],
    queryFn: ({ pageParam = 1 }) => {
      if (viewAllFlag === false) {
        return Promise.resolve(null);
      }
      if (typeof pageParam === 'object') {
        return Promise.resolve(null); // Skip the API call
      }

      const queryPayload = {
        ...(isFiltersHidden ? payload : updatedPayload),
        page_number: isPaginationHidden ? 1 : pageParam,
      };
      return ProductAPI({ pageParam: queryPayload });
    },
    getNextPageParam: (lastPage) => {
      if (viewAllFlag) {
        const nextPage = lastPage.page_number + 1;
        return nextPage <= lastPage.total_page ? nextPage : undefined;
      }
      return lastPage;
    },
    enabled: router.isReady,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (currentPage && currentPage > 1) {
      fetchNextPage();
    }
  }, [currentPage, fetchNextPage]);

  const updateFilterData = () => {
    if (router.isReady) {
      const { query } = router;
      const newFilterPayload: ProductFilterState = {};
      const newSortPayload: ProductSortState[] = [];

      // Parse and set filters
      Object.keys(query).forEach((key) => {
        if (key.startsWith('facet_')) {
          const facetName = key.replace('facet_', '');
          const facetValues = Array.isArray(query[key]) ? query[key] : [query[key]];
          newFilterPayload[facetName] = { value: facetValues as string[] };
        }
      });

      // Parse and set sort
      if (query.sortby && query.sortorder) {
        newSortPayload.push({
          name: query.sortby as string,
          order: query.sortorder as 'asc' | 'desc',
        });
      }

      // Set page number
      if (query.pageNumber && query.pageNumber !== 'all') {
        setCurrentPage(parseInt(query.pageNumber as string, 10));
      }

      // Update state
      setFilterPayload(newFilterPayload);
      setSortPayload(newSortPayload);
    }
  };

  // initially set filter if present and remove atom after page unmount
  useEffect(() => {
    delete router.query.path;
    Object.keys(router.query).length > 0 && updateFilterData();

    return () => {
      setFilterData([]), setFilterPayload({}), setSortPayload([]), setCurrentPage(1);
    };
  }, [router.isReady, router.asPath]);

  // update payload
  useEffect(() => {
    handleFetchData(updatedPayload);
  }, [filterPayload, sortPayload, currentPage, searchTerm, uriPath]);

  useEffect(() => {
    if (fromSearch === 'true') {
      setSitecorePath(path);
      setFilterData([]), setSortPayload([]), setCurrentPage(1);
      removeSessionData('tts_fromSearch');
    } else if (sitecorePath && sitecorePath !== '' && sitecorePath !== path) {
      setFilterData([]), setFilterPayload({}), setSortPayload([]), setCurrentPage(1);
    }
  }, [sitecorePath, fromSearch, path]);

  useEffect(() => {
    if (path && path !== '') {
      setSitecorePath((prevPath) => {
        // Update only if the new path is different from the previous value
        if (prevPath !== path) {
          return path;
        }
        return prevPath; // No change if the path is the same
      });
    }
  }, [path]);

  useEffect(() => {
    if (router.isReady && mutation?.data?.redirect_url) {
      router.push(mutation.data.redirect_url);
    }
  }, [router.isReady, mutation?.data?.redirect_url]);

  return (
    <div className="container mx-auto">
      {mutation.data?.content?.product?.value && router?.asPath?.includes('Search') && (
        <ProductSearch
          searchResults={mutation.data?.content?.product?.value?.length > 0}
          {...props}
        />
      )}
      {!isFiltersHidden && (
        <ProductListingFilters
          filters={viewAllFlag ? prod?.pages[0] : mutation?.data}
          {...props}
          isFilter={mutation.data?.content?.product?.value?.length > 0}
        />
      )}

      {prod?.pages?.map((page) => {
        return (
          <ProductListing
            key={page?.page_number}
            id={page?.page_number}
            products={viewAllFlag ? page : mutation.data}
            {...props}
          />
        );
      })}
      {!isPaginationHidden && (
        <ProductPagination
          pagination={viewAllFlag ? prod?.pages[0] : mutation?.data}
          {...props}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
};
export default Products;

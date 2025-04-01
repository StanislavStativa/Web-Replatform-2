import {
  InfiniteQueryObserverResult,
  InfiniteData,
  FetchNextPageOptions,
} from '@tanstack/react-query';
import { ProductListingData, ProductListingProps } from '../ProductListing/ProductListing.type';

export interface PageProps extends ProductListingData {
  page_number: number;
  total_item: number;
  total_page: number;
}

export interface ProductPaginationProps extends ProductListingProps {
  pagination: PageProps;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>>;
  isLoading: boolean;
  hasNextPage: boolean;
}

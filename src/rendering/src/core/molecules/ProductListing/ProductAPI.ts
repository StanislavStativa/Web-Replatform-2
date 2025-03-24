import axios from 'axios';
import { ProductPayloadProps } from './ProductListing.type';
import Cookies from 'js-cookie';
import { PRODUCTLIST_RUID } from '@/config';

export const productUrl: string = `${process.env.NEXT_PUBLIC_DISCOVER_HOST}${process.env.NEXT_PUBLIC_DISCOVER_SEARCH_API}`;
export const productStoreId: string = process.env.NEXT_PUBLIC_PRODUCT_STORE_ID ?? '';
export const UUID: string = Cookies.get(PRODUCTLIST_RUID) ?? '';
const ProductAPI = async ({ pageParam }: { pageParam: ProductPayloadProps }) => {
  console.time('getDiscoverSearch');
  const response = await axios.post(productUrl, {
    data: pageParam,
  });
  const data = await response.data;
  console.timeEnd('getDiscoverSearch');
  return data;
};

export default ProductAPI;

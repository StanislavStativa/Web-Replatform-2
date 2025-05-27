import {
  ComponentParams,
  ComponentRendering,
  Field,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ProductFilterData } from '../ProductListingFilters/ProductFilter.type';
import { CartItem } from '@/core/cartStore/CartStoreType';

export interface ProductListingProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: ProductListingFields };
  params: ComponentParams;
  btnText?: {
    jsonValue: TextField;
  };
  btnFunctionality: {
    jsonValue: Field<string>;
  };
  extendedStyling?: boolean;
}

export interface ProductListingPageProps extends ProductListingProps {
  products: ProductListingData;
  id?: string;
}
export interface ProductFiltersPageProps extends ProductListingProps {
  filters: ProductFilterData;
  isFilter: boolean;
}

export interface ProductListingFields {
  APIEndPoint: Field<string>;
  DefaultItemsPerPageDesktop: Field<string>;
  DefaultItemsPerPageMobile: Field<string>;
  DiscoverRfkId: Field<string>;
  NoResultText: Field<string>;
  HideFilters: Field<boolean>;
  HideSorting: Field<boolean>;
  HidePagination: Field<boolean>;
  ButtonText: Field<string>;
  ButtonFunctionality: Field<string>;
}
export interface SearchResultProps extends ProductListingProps {
  searchResults: boolean;
}

export interface ProductListingData {
  content: {
    product: {
      n_item: number;
      total_item: number;
      value: ProductListingCard[];
    };
  };
}

export interface ProductListingCard {
  id: number;
  sku_image_url?: string;
  price: number;
  final_price?: number;
  sample_price?: number;
  name: string;
  stock_unit: string;
  inspiration_image_url?: string;
  is_clearance?: boolean;
  is_everyday_value?: boolean;
  is_featured?: boolean;
  is_new_arrival?: boolean;
  rankby1?: number;
  product_url: string;
  sku?: string;
  isProductDetails?: boolean;
  sample_sku_pro?: string;
  sample_sku_retail?: string;
  cartItem: CartItem[];
  material_group?: string;
  collection?: string;
  product_hierarchy1?: string;
  product_hierarchy2?: string;
  brand?: string;
  final_price_purchase?: number;
  price_purchase_retail?: number;
  discoverRfkId: string;
  btnText?: string;
  btnFunctionality?: string;
  isExtendedStyle?: boolean;
}

export interface ProductPayloadProps {
  context: {
    page: { uri: string };
    sku?: (string | undefined)[];
    store: { id: string };
    user: { uuid: string };
  };
  widget: { rfkid: string };
  n_item?: number;
  page_number?: number;
  facet?: {
    all?: boolean;
    shape?: { value: never[] };
    color?: { value: never[] };
    material?: { value: never[] };
  };
  sort?: { value: { name: string; order: string }[]; choices: boolean };
  content?: object;
  filter?: {
    [key: string]: {
      value: string[];
    };
  };
  suggestion?: { keyphrase: { max: number }; category: { max: number } };
  query?: {
    keyphrase: {
      value: string[];
    };
  };
}
export interface ProductFilterState {
  [key: string]: {
    value: string[];
  };
}
export interface ProductSortState {
  name: string;
  order: string;
}

export interface AvailableFacetsFields {
  FacetName: Field<string>;
  FacetOptionData: Field<string>;
  ProductAttribute: Field<string>;
}

export interface FacetItem {
  fields: {
    FacetName: Field<string>;
  };
}

export type ITypesPLPEventData = {
  item_list_id: string;
  item_list_name: string;
  items: {
    discount: number;
    index: number;
    item_brand: string | undefined;
    item_category: string;
    item_category2: string;
    item_category3: string;
    item_category4: string;
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }[];
} | null;

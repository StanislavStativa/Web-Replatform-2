import { ApiRole, CookieOptions } from 'ordercloud-javascript-sdk';
import { getEnv } from './get-env';

export const REFRESH_TOKEN = 'refresh_token';
export const PERMISSIONS = 'permissions';
export const AUTH_TOKEN = 'auth_token';
export const WECO_AUTH_TOKEN = 'weco_auth_token';
export const WECO_REFRESH_TOKEN = 'weco_refresh_token';
export const SITE_ID = 'site_id';
export const CUST_ID = 'cust_id';
export const CUST_NUM = 'cust_num';
export const CUST_NAME = 'cust_name';
export const PRICE_GP = 'price_gp';
export const IS_PROUSER = 'is_prouser';
export const IS_NET_PRO = 'is_net_prouser';
export const CAN_CREATE_USER = 'can_create_user';
export const USR_PREFERRED_STORE = 'user_preferred_store';
export const USR_EMAIL = 'tts_email';

export const SALE_ORG = 'sale_org';
export const DIST_CHNL = 'dist_chnl';
export const PRODUCTLIST_RUID = '__ruid';
export const PRODUCTLIST_SORT = 'featured';
export const MAINSECTION_INSPIRATION_BLOG = 'Blog';
export const ANONYMOUS_SCOPE: ApiRole[] = ['Shopper'];
export const ProductList_PAYLOAD_CONTENT = [
  'id',
  'sku',
  'name',
  'price',
  'sku_image_url',
  'product_url',
  'final_price',
  'stock_unit',
  'inspiration_image_url',
  'available_online_sample',
  'is_clearance',
  'is_everyday_value',
  'is_featured',
  'is_new_arrival',
  'rankby1',
  'sample_sku_retail',
  'sample_sku_pro',
  'sample_price',
  'material_group',
  'collection',
  'product_hierarchy1',
  'product_hierarchy2',
  'brand',
  'final_price_purchase',
  'price_purchase_retail',
];
export const CLIENT_SCOPE: ApiRole[] = [
  'BuyerUserReader',
  'CreditCardReader',
  'CreditCardAdmin',
  'MeAddressAdmin',
  'MeAdmin',
  'MeCreditCardAdmin',
  'MeSubscriptionAdmin',
  'MeXpAdmin',
  'OrderAdmin',
  'OverrideShipping',
  'OverrideUnitPrice',
  'PasswordReset',
  'ProductReader',
  'Shopper',
  'SpendingAccountReader',
  'SubscriptionAdmin',
  'OverrideTax',
  'CreditCardAdmin',
  'PromotionAdmin',
  'PromotionReader',
  'PriceScheduleAdmin',
  'PriceScheduleReader',
  'UnsubmittedOrderReader',
  'AddressAdmin',
  'AddressReader',
  'BuyerUserAdmin',
];

export interface OcConfig {
  clientId: string;
  scope: ApiRole[];
  baseApiUrl?: string;
  allowAnonymous?: boolean;
  cookieOptions?: CookieOptions;
  catalogId: string;
}

const ocConfig: OcConfig = {
  clientId: getEnv('NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID') as string,
  baseApiUrl: getEnv('NEXT_PUBLIC_ORDERCLOUD_API_ENDPOINT') as string,
  catalogId: getEnv('NEXT_PUBLIC_ORDERCLOUD_CATALOG_ID') as string,
  scope: CLIENT_SCOPE,
  allowAnonymous: false,
  cookieOptions: undefined,
};

type EventType = {
  LOGIN: string;
  SAMPLE_CTA_PLP: string;
  SAMPLE_CTA_PDP: string;
  SIGNUP: string;
  VIEW_ITEM_LIST: string;
  SELECT_ITEM: string;
  VIEW_ITEM: string;
  ADD_TO_CART: string;
  REMOVE_FROM_CART: string;
  VIEW_CART: string;
  BEGIN_CHECKOUT: string;
  ADD_SHIPPING_INFO: string;
  ADD_PAYMENT_INFO: string;
  PURCHASE: string;
};

export const event: EventType = {
  LOGIN: 'login',
  SAMPLE_CTA_PLP: 'add_sample_CTA_click_PLP',
  SAMPLE_CTA_PDP: 'add_sample_CTA_click_PDP',
  SIGNUP: 'sign_up',
  VIEW_ITEM_LIST: 'view_item_list',
  SELECT_ITEM: 'select_item',
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  VIEW_CART: 'view_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
};

export default ocConfig;

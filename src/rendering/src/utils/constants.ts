export enum SIZE {
  XSmall = 'XSmall',
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
}

export enum ALIGNMENT {
  LEFT = 'Left',
  RIGHT = 'Right',
  CENTER = 'Center',
  JUSTIFY = 'Justify',
  TOP = 'Top',
  BOTTOM = 'Bottom',
}

export enum THEME {
  LIGHT = 'Light',
  DARK = 'Dark',
}
export enum OUTLINETHEME {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export const FALLBACK_LANG = 'en';
export const SITE_PAGE_PATTERN =
  /^(\/\/www\.tileshop\.com\/|http:\/\/tileshop\.com\/en-US\/|https:\/\/www\.tileshop\.com\/)/;

export const MOBILE_MAX_WIDTH = 768;
export const TABLET_MAX_WIDTH = 1024;

export enum PROACCOUNT {
  COUNTRY = 'US',
  USERTYPE = 'PRO',
}

export enum PERSONALACCOUNT {
  COUNTRY = 'US',
  USERTYPE = 'Retail',
}

export enum CHECKBOOLEANTYPEFROMSTRING {
  TRUE = 'true',
  FALSE = 'false',
}

export enum FORM_SUBMITTED_ERROR_MESSAGES {
  DEFAULT = 'Something went wrong, please try again',
}

export const ACCOUNTTYPES = {
  PROACCOUNT: 'Pro Account',
  PERSONALACCOUNT: 'Personal Account',
};
export const enum DOCUMNETTYPE {
  CSV = 'csv',
  TEXT = 'text',
  XML = 'xml',
  PDF = 'pdf',
  XLS = 'xls',
  XLSX = 'xlsx',
}
export const addressBookTablePageList = [
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: 'All', value: '-1' },
];
export const projectDownloadType = [{ label: 'CSV', value: DOCUMNETTYPE.CSV }];

export const enum SEARCHQUERYSTRING {
  CALLBACK_URL = 'returnurl',
}

export const enum PAGENAME {
  SHIPPING = 'shipping',
  PAYMENT = 'payment',
  REVIEW = 'order-review',
  CART = 'shopping-cart',
}

export const enum COUNTRYNAMES {
  US = 'US',
}
export const enum PAYMENTOPTIONS {
  CREDITCARD = 'Credit_Card',
  CITIZENPAY = 'Citizen_Pay',
  INVOICE = 'Invoice',
}

export const enum ADVANCESEARCHDROPSID {
  STATUS = 'STATUS',
  STATUSDUE = 'MY STATUS_DUE',
  PERIODE = 'PERIODE',
  CHAR = 'CHAR',
  SOLDTO = 'SOLDTO',
  SHIPTO = 'SHIPTO',
  ORDER = 'ZZORDERTYPE',
  FILTERBY = 'ZZDOCTYFI',
}

export const enum USEORDERENDPOINT {
  ORDER = 'orders',
  SELECTION = 'selectionSheets',
  QUOTES = 'quotes',
  BILLING = 'billing',
  PAYMENT = 'payment',
  STATUS_DUE = 'STATUS_DUE',
  DUE = 'DUE',
}

export const PDPURL = 'products';
export const isPDfCheckVal = 'IN';
export const enum TABLESORT {
  ASC = 'asc',
  DESC = 'desc',
}

export const enum PAYMENTFILTER {
  CREDITCARDS = 'Credit Cards',
  INVOICE = 'Invoice',
}

export const ADDNEWADDRESS = 'addNew';

export const OCCITIZENPAYLIMIT = 500;

export const OCNONPRONAV = ['My Account Billing', 'Rewards']; //Todo :- Need better approach

type OrderTypeMap = {
  [key: number]: string;
};
export const ORDERTYPEMAP: OrderTypeMap = {
  1: 'My Order',
  2: 'Referred',
  3: 'All',
};

export const CREATEUSERIDS = [
  '{207CD426-EF35-40DA-A26B-DDC68A9CB6A9}',
  '{3356FCD2-CC5F-40BB-9AB0-70B548BB0882}',
];
export const CREATEUERCARDIDS = [
  '3fa17eb6-9a2e-4f1f-9dfd-23dcdd3c5fb3',
  '2e5e411a-dfec-4882-821e-b1b9cecb7ac9',
];

export const enum PROTERMSOFPAYMENT {
  NETTHIRTY = 'NT30',
  NETFOURTYFIVE = 'NT45',
  NETNINENTY = 'NT90 ',
  NETZERO = 'Z000 ',
}

export const DOWNLOADBASEURL = '/api/myaccount/DownloadDoc';
export const BLOGDISPLAY = 'blog';
export const enum DOCUMENTTYPEFI {
  STORE = 'DZ',
  INVOICE = 'RV',
}

export const EXCLUDED_TEMPLATES = ['d99a18de-5be0-4989-bf07-295cbf6054a0'];

export const blogSitemapUrls = [
  {
    url: 'https://tileshopblog.wpengine.com/post-sitemap.xml',
    lastmod: '2025-01-10T16:41:02+00:00',
  },
  {
    url: 'https://tileshopblog.wpengine.com/page-sitemap.xml',
    lastmod: '2018-10-12T18:09:19+00:00',
  },
  {
    url: 'https://tileshopblog.wpengine.com/category-sitemap.xml',
    lastmod: '2025-01-10T16:41:02+00:00',
  },
];

export const paymentDocType: Record<string, string> = {
  DG: 'Payment_Invoice_DG',
  DR: 'Payment_Invoice_DR',
  DV: 'Payment_Invoice_DV',
  DZ: 'Payment_Invoice_DZ',
  RV: 'Payment_Invoice_RV',
  YZ: 'Payment_Invoice_YZ',
  Z2: 'Payment_Invoice_Z2',
  Z3: 'Payment_Invoice_Z3',
  ZG: 'Payment_Invoice_ZG',
  ZO: 'Payment_Invoice_ZO',
};

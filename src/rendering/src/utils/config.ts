import { LayoutServicePageState, SitecoreContextValue } from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import { getPublicUrl } from '@/utils/url';

const DEFAULT_CONFIG = {
  NEXT_PUBLIC_URL: 'https://www.tileshop.com/',
  DEFAULT_LANGUAGE: 'en',
};

export const getEnvParam = (name: string) => {
  const value = process?.env?.[name as keyof typeof process.env];
  if (value) {
    return value;
  }

  if (name === 'NEXT_PUBLIC_URL' && typeof window !== 'undefined') {
    return `${window.location.origin}/`;
  }

  const defaultValue = DEFAULT_CONFIG[name as keyof typeof DEFAULT_CONFIG];
  if (defaultValue) {
    return defaultValue;
  }

  return '';
};

export const checkIsNotNormal = (sitecoreContext?: SitecoreContextValue) =>
  sitecoreContext?.pageState !== LayoutServicePageState.Normal;
export const checkIsOnlyEdit = (sitecoreContext?: SitecoreContextValue) =>
  sitecoreContext?.pageState === LayoutServicePageState.Edit;

export const getPublicUrlWithLocale = (sitecoreContext?: SitecoreContextValue) => {
  const locale = sitecoreContext?.language?.toLowerCase() || config.defaultLanguage;
  return `${getPublicUrl()}${locale}`;
};

export const formatUrl = (url?: string) => url?.replaceAll(' ', '-')?.toLowerCase();

export const getPageUrl = (sitecoreContext?: SitecoreContextValue) =>
  `${getPublicUrlWithLocale(sitecoreContext)}${formatUrl(sitecoreContext?.itemPath as string)}`;

export const convertDateFormat = (dateString: string): string => {
  const [month, day, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const getAdvanceSearchParam = (
  isBillingHistory: boolean,
  isPaymentHistory: boolean,
  isQuotes: boolean,
  isOrderHistory: boolean
) => {
  if (isBillingHistory) return 'billingHistory';
  if (isPaymentHistory) return 'paymentHistory';
  if (isQuotes) return 'quotes';
  if (isOrderHistory) return 'orderHistory';
  return 'default';
};

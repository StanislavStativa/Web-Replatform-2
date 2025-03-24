import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
export interface ITypesAdvanceSearchResult {
  id: string;
  Icon: LinkField;
  Title: Field<string>;
  isOrderHistory: boolean;
  isBillingHistory: boolean;
  isQuotes: boolean;
  isSelectionSheet: boolean;
  handleBack: () => void;
  docType: string;
  description: Field<string>;
  currentIdStatus: string;
  uniqueId: number;
}
export type ITypesSearchResultTableData = {
  sku: string;
  image: string;
  status: string;
  store: string;
  qty: string;
  retailPrice: string;
  yourTotal: string;
  yourPrice: string;
  description: string;
};

export type ITypesModifiedSearchData = {
  extMaterialNumber: string;
  status: string;
  quantity: string;
  unit: string;
  grossPrice: string;
  netPrice: string;
  netValue: string;
  description: string;
};

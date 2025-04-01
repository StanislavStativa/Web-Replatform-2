import { WECOFilterRequest } from '@/api/models/WECOFilterRequest';
import { EndpointType } from '@/hooks/useOrdersMutation';
import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesAdvanceSearch {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesAdvanceSearchFields;
  };
  params: ComponentParams;
}
export interface ITypesAdvanceSearchFields {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
}
export type ITypesDropDown = {
  value: string;
  label: string;
};
export type ITypesAdvanceSearchForm = {
  filters: ITypesAdvanceFilters[];
  isOrderHistory: boolean;
  isQuotes: boolean;
  isSelectionSheet: boolean;
  isBillingHistory: boolean;
  isPaymentHistory: boolean;
  fetchOrderHistory: (filters: WECOFilterRequest, endpoint: EndpointType) => void;
  message: string;
  isDownload: boolean;
  docType: string;
};
export interface CurrentItemList {
  id: string;
  orderNumber: string;
  status: string;
}
export interface ITypesSearchTableData {
  status: string;
  documentNumber: string;
  date: string;
  poNumber: string;
  referred: string;
  orderTotal: string;
}
export interface ITypesQuotesTableData {
  status: string;
  documentNumber: string;
  date: string;
  purchaseOrder: string;
  referred: string;
  orderTotal: string;
}
export interface ITypesOrderHistoryTable {
  status: string;
  documentNumber: string;
  date: string;
  poNumber: string;
  referred: string;
  orderTotal: string;
  customer: string;
}

export interface ITypesPaymentTableData {
  documentNumber: string;
  date: string;
  documentType: string;
  clearingDate: string;
  poNumber: string;
  invoice: string;

  amount: string;
  customer: string;
}

export interface ITypesBillingTableData {
  status: string;
  invoice: string;
  orderNumber: string;
  poNumber: string;
  date: string;
  saleTotal: string;
  paid: string;
  open: string;
  dueDate: string;
  in: string;
  customer: string;
}
export type ITypesFiltersVal = {
  value: string;
  description: string;
  isSelected: boolean;
  isCustomValue: boolean;
  customValue: string;
  misc?: string;
};
export type ITypesFilters = {
  id: string;
  description?: string;
  isMultiselect: boolean;
  isHidden: boolean;
  values: ITypesFiltersVal[] | [];
  isSelected?: ITypesFiltersVal;
};
export type ITypesAdvanceFilters = {
  id: string;
  description?: string;
  isMultiselect: boolean;
  isHidden: boolean;
  values: ITypesFiltersVal[] | [];
  dropOptions?: ITypesDropDown[];
  isSelected?: ITypesFiltersVal;
};

export type ITypesSearchTableList = {
  id: string;
} & ITypesSearchTableData;
export type ITypesPdf = {
  id: number;
  description: string;
  headerDescription: string;
};
export interface ITypesOrderDocument {
  customer: string;
  referred: string;
  id: string;
  status: string;
  date: string;
  referenceNumber: string;
  total: string;
  documentDate: string;
  clearingDocumentNumber: string;
  clearingDate: string;
  netValuePayed: string;
  netValueOpen: string;
  dueTo: string;
  customerAddress: string;
  documentType: string;
  zzcustom: {
    orderNumber: string;
    documentTypeFi: string;
    clearDate: string;
    documentTypeFiDescription: string;
    orderType: number;
    customStatus: string;
  };
  pdfs: ITypesPdf[] | [];
}

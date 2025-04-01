import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ITypesInvoiceSearchList } from '../SearchInvoice/SearchInvoiceTable/SearchInvoiceTable.type';
export type ITypesPayInvoice = {
  goBack: () => void;
  selectedInvoices: ITypesInvoiceSearchList[] | [];
  icon: LinkField;
  amountAssigned: number;
  notes?: string;
  isPayAccount?: boolean;
};

export interface ITypesPayInvoiceData {
  invoice: string;
  orderNumber: string;
  open: string;
}

export type ITypesConfirmPayment = {
  fiDocumentNumber: string;
  fiscalYear: number;
  authorizationNumber: string;
  authorizationRefCode: string;
  amountAuthorized: number;
  currency: string;
};

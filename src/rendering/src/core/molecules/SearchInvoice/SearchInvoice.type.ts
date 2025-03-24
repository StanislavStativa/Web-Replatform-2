import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface ITypesSearchInvoice {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesSearchInvoiceFields;
  };
  params: ComponentParams;
}

export type ITypesSearchInvoiceFields = {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
};
export type ITypesPdf = {
  id: number;
  description: string;
  headerDescription: string;
};
export type ITypesModifiedProjectList = {
  id: string;
  zzcustom: { orderNumber: string; documentTypeFi: string; referenceNumber: string };
  date: string;
  netValue: string;
  netValuePayed: string;
  netValueOpen: string;
  payedOn: string;
  customerAddress: string;
  pdfs: ITypesPdf[] | [];
  total: string;
  dueTo: string;
  referenceNumber: string;
  documentDate: string;
  fiscalYear: number;
  valuePayed: number;
  valueOpen: number;
  financeDocumentType: string;
  fiDocumentLineItem: number;
  fiDocumentNumber: string;
};

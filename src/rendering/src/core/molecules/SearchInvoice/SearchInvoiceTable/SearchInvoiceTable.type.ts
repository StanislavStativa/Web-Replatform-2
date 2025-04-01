export interface ITypesInvoiceSearchList {
  id: string;
  invoice?: string;
  orderNumber?: string;
  poNumber: string;
  date?: string;
  saleTotal?: string;
  paid: string;
  open?: React.ReactElement;
  dueDate?: string;
  in: string;
  customer: JSX.Element;
  netValue: string;
  orderTotal?: string;
  fiscalYear: string;
  openValue: string;
  fiDocumentLineItem: number;
  fiDocumentNumber: string;
}
export interface ITypesSearchInvoiceTable {
  searchList: ITypesInvoiceSearchList[];
  getCheckedCol: (selectedRows: string[]) => void;
  selectedColumns: string[] | [];
  openPayInvoice: () => void;
  downloadFile: (id: string) => void;
  totalOpenAmount: number;
  amountAssigned: number;
  reftech: () => void;
}

export interface ITypesSearchInTableData {
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
  documentType: string;
}

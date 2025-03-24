/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepositDetail } from './DepositDetail';
import type { Document } from './Document';
export type InvoicePaymentRequest = {
  customerName?: string | null;
  cardNumber?: string | null;
  cardType?: string | null;
  month?: string | null;
  year?: string | null;
  transactionAmount?: number;
  tokenid?: string | null;
  cvvCode?: string | null;
  cardZipCode?: string | null;
  documents?: Array<Document> | null;
  depositDetail?: DepositDetail;
};

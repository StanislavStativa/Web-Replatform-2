/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Card } from './Card';
export type AuthorizeRequest = {
  accountid?: number;
  currency?: string | null;
  companycode?: string | null;
  customerid?: string | null;
  userid?: string | null;
  mode?: string | null;
  reference?: string | null;
  purchaseorder?: string | null;
  orderid?: string | null;
  invoiceid?: string | null;
  cards?: Array<Card> | null;
};

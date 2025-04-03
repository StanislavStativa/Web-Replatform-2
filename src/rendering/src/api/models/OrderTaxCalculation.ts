/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemTaxCalculation } from './LineItemTaxCalculation';
import type { TaxDetails } from './TaxDetails';
export type OrderTaxCalculation = {
  orderID?: string | null;
  externalTransactionID?: string | null;
  totalTax?: number;
  lineItems?: Array<LineItemTaxCalculation> | null;
  orderLevelTaxes?: Array<TaxDetails> | null;
};

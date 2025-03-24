/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxDetails } from './TaxDetails';
export type LineItemTaxCalculation = {
  lineItemID?: string | null;
  lineItemTotalTax?: number;
  lineItemLevelTaxes?: Array<TaxDetails> | null;
};

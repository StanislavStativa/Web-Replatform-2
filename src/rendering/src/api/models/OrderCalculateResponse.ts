/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemOverride } from './LineItemOverride';
export type OrderCalculateResponse = {
  lineItemOverrides?: Array<LineItemOverride> | null;
  shippingTotal?: number | null;
  taxTotal?: number | null;
  httpStatusCode?: number | null;
  unhandledErrorBody?: string | null;
  xp?: any;
  succeeded?: boolean;
};

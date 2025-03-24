/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemOverrideWithXp } from './LineItemOverrideWithXp';
import type { OrderCalculateResponseXp } from './OrderCalculateResponseXp';
export type OrderCalculateResponseWithXp = {
  lineItemOverrides?: Array<LineItemOverrideWithXp> | null;
  shippingTotal?: number | null;
  taxTotal?: number | null;
  httpStatusCode?: number | null;
  unhandledErrorBody?: string | null;
  xp?: OrderCalculateResponseXp;
  succeeded?: boolean;
};

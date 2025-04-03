/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemProduct } from './LineItemProduct';
import type { LineItemSpec } from './LineItemSpec';
import type { LineItemVariant } from './LineItemVariant';
export type ShipmentItem = {
  orderID?: string | null;
  lineItemID?: string | null;
  quantityShipped?: number;
  unitPrice?: number | null;
  costCenter?: string | null;
  dateNeeded?: string | null;
  product?: LineItemProduct;
  variant?: LineItemVariant;
  specs?: Array<LineItemSpec> | null;
  xp?: any;
};

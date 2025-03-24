/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemProductWithXp } from './LineItemProductWithXp';
import type { LineItemSpec } from './LineItemSpec';
import type { LineItemVariantWithXp } from './LineItemVariantWithXp';
import type { ShipmentItemXp } from './ShipmentItemXp';
export type ShipmentItemWithXp = {
  orderID?: string | null;
  lineItemID?: string | null;
  quantityShipped?: number;
  unitPrice?: number | null;
  costCenter?: string | null;
  dateNeeded?: string | null;
  product?: LineItemProductWithXp;
  variant?: LineItemVariantWithXp;
  specs?: Array<LineItemSpec> | null;
  xp?: ShipmentItemXp;
};

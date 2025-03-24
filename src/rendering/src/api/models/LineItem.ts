/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { LineItemProduct } from './LineItemProduct';
import type { LineItemSpec } from './LineItemSpec';
import type { LineItemVariant } from './LineItemVariant';
export type LineItem = {
  id?: string | null;
  productID?: string | null;
  quantity?: number;
  dateAdded?: string;
  quantityShipped?: number;
  unitPrice?: number | null;
  promotionDiscount?: number;
  lineTotal?: number;
  lineSubtotal?: number;
  costCenter?: string | null;
  dateNeeded?: string | null;
  shippingAccount?: string | null;
  shippingAddressID?: string | null;
  shipFromAddressID?: string | null;
  product?: LineItemProduct;
  variant?: LineItemVariant;
  shippingAddress?: Address;
  shipFromAddress?: Address;
  supplierID?: string | null;
  inventoryRecordID?: string | null;
  priceScheduleID?: string | null;
  priceOverridden?: boolean;
  specs?: Array<LineItemSpec> | null;
  xp?: any;
};

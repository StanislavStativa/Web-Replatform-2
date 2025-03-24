/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressWithXp } from './AddressWithXp';
import type { LineItemProductWithXp } from './LineItemProductWithXp';
import type { LineItemSpec } from './LineItemSpec';
import type { LineItemVariantWithXp } from './LineItemVariantWithXp';
import type { LineItemXp } from './LineItemXp';
import type { ShipFromAddressWithXp } from './ShipFromAddressWithXp';
export type LineItemWithXp = {
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
  product?: LineItemProductWithXp;
  variant?: LineItemVariantWithXp;
  shippingAddress?: AddressWithXp;
  shipFromAddress?: ShipFromAddressWithXp;
  supplierID?: string | null;
  inventoryRecordID?: string | null;
  priceScheduleID?: string | null;
  priceOverridden?: boolean;
  specs?: Array<LineItemSpec> | null;
  xp?: LineItemXp;
};

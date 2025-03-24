/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Inventory } from './Inventory';
export type Product = {
  ownerID?: string | null;
  defaultPriceScheduleID?: string | null;
  autoForward?: boolean;
  id?: string | null;
  name?: string | null;
  description?: string | null;
  quantityMultiplier?: number | null;
  shipWeight?: number | null;
  shipHeight?: number | null;
  shipWidth?: number | null;
  shipLength?: number | null;
  active?: boolean;
  specCount?: number;
  variantCount?: number;
  shipFromAddressID?: string | null;
  inventory?: Inventory;
  defaultSupplierID?: string | null;
  allSuppliersCanSell?: boolean;
  returnable?: boolean;
  xp?: any;
};

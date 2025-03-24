/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductXp } from './ProductXp';
export type AdHocProductWithXp = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  quantityMultiplier?: number | null;
  shipWeight?: number | null;
  shipHeight?: number | null;
  shipWidth?: number | null;
  shipLength?: number | null;
  defaultSupplierID?: string | null;
  returnable?: boolean;
  xp?: ProductXp;
};

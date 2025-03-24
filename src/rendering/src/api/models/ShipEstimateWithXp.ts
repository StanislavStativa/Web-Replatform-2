/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShipEstimateItem } from './ShipEstimateItem';
import type { ShipEstimateXp } from './ShipEstimateXp';
import type { ShipMethodWithXp } from './ShipMethodWithXp';
export type ShipEstimateWithXp = {
  id?: string | null;
  xp?: ShipEstimateXp;
  selectedShipMethodID?: string | null;
  shipEstimateItems?: Array<ShipEstimateItem> | null;
  shipMethods?: Array<ShipMethodWithXp> | null;
};

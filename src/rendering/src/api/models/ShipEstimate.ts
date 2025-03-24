/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShipEstimateItem } from './ShipEstimateItem';
import type { ShipMethod } from './ShipMethod';
export type ShipEstimate = {
  id?: string | null;
  xp?: any;
  selectedShipMethodID?: string | null;
  shipEstimateItems?: Array<ShipEstimateItem> | null;
  shipMethods?: Array<ShipMethod> | null;
};

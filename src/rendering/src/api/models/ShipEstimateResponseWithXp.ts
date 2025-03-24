/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShipEstimateResponseXp } from './ShipEstimateResponseXp';
import type { ShipEstimateWithXp } from './ShipEstimateWithXp';
export type ShipEstimateResponseWithXp = {
  shipEstimates?: Array<ShipEstimateWithXp> | null;
  httpStatusCode?: number | null;
  unhandledErrorBody?: string | null;
  xp?: ShipEstimateResponseXp;
  succeeded?: boolean;
};

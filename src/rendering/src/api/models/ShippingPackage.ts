/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { CustomsInfo } from './CustomsInfo';
import type { InsuranceInfo } from './InsuranceInfo';
export type ShippingPackage = {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  shipFrom?: Address;
  shipTo?: Address;
  returnAddress?: Address;
  signatureRequired?: boolean;
  insurance?: InsuranceInfo;
  customs?: CustomsInfo;
};

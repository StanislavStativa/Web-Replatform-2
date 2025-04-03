/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomsItem } from './CustomsItem';
import type { CustomsNonDeliveryOption } from './CustomsNonDeliveryOption';
export type CustomsInfo = {
  eeL_PFC?: string | null;
  contentType?: string | null;
  explanation?: string | null;
  nonDeliveryOption?: CustomsNonDeliveryOption;
  items?: Array<CustomsItem> | null;
};

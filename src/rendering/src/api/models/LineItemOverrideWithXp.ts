/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartialAdHocProduct } from './PartialAdHocProduct';
import type { PromotionOverride } from './PromotionOverride';
export type LineItemOverrideWithXp = {
  lineItemID?: string | null;
  unitPrice?: number | null;
  promotionOverrides?: Array<PromotionOverride> | null;
  remove?: boolean | null;
  product?: PartialAdHocProduct;
};

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionXp } from './PromotionXp';
export type OrderPromotionWithXp = {
  amount?: number;
  lineItemID?: string | null;
  id?: string | null;
  lineItemLevel?: boolean;
  code?: string | null;
  name?: string | null;
  redemptionLimit?: number | null;
  redemptionLimitPerUser?: number | null;
  redemptionCount?: number;
  description?: string | null;
  finePrint?: string | null;
  startDate?: string | null;
  expirationDate?: string | null;
  eligibleExpression?: string | null;
  valueExpression?: string | null;
  canCombine?: boolean;
  allowAllBuyers?: boolean;
  ownerID?: string | null;
  xp?: PromotionXp;
};

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemWithXp } from './LineItemWithXp';
import type { OrderApprovedResponseWithXp } from './OrderApprovedResponseWithXp';
import type { OrderCalculateResponseWithXp } from './OrderCalculateResponseWithXp';
import type { OrderPromotionWithXp } from './OrderPromotionWithXp';
import type { OrderSubmitForApprovalResponseWithXp } from './OrderSubmitForApprovalResponseWithXp';
import type { OrderSubmitResponseWithXp } from './OrderSubmitResponseWithXp';
import type { OrderWithXp } from './OrderWithXp';
import type { ShipEstimateResponseWithXp } from './ShipEstimateResponseWithXp';
export type OrderWorksheetWithXp = {
  order?: OrderWithXp;
  lineItems?: Array<LineItemWithXp> | null;
  orderPromotions?: Array<OrderPromotionWithXp> | null;
  shipEstimateResponse?: ShipEstimateResponseWithXp;
  orderCalculateResponse?: OrderCalculateResponseWithXp;
  orderSubmitResponse?: OrderSubmitResponseWithXp;
  orderSubmitForApprovalResponse?: OrderSubmitForApprovalResponseWithXp;
  orderApprovedResponse?: OrderApprovedResponseWithXp;
};

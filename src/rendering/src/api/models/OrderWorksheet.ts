/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItem } from './LineItem';
import type { Order } from './Order';
import type { OrderApprovedResponse } from './OrderApprovedResponse';
import type { OrderCalculateResponse } from './OrderCalculateResponse';
import type { OrderPromotion } from './OrderPromotion';
import type { OrderSubmitForApprovalResponse } from './OrderSubmitForApprovalResponse';
import type { OrderSubmitResponse } from './OrderSubmitResponse';
import type { ShipEstimateResponse } from './ShipEstimateResponse';
export type OrderWorksheet = {
  order?: Order;
  lineItems?: Array<LineItem> | null;
  orderPromotions?: Array<OrderPromotion> | null;
  shipEstimateResponse?: ShipEstimateResponse;
  orderCalculateResponse?: OrderCalculateResponse;
  orderSubmitResponse?: OrderSubmitResponse;
  orderSubmitForApprovalResponse?: OrderSubmitForApprovalResponse;
  orderApprovedResponse?: OrderApprovedResponse;
};

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemWithXp } from './LineItemWithXp';
import type { OrderApprovalWithXp } from './OrderApprovalWithXp';
import type { OrderReturnWithXp } from './OrderReturnWithXp';
import type { OrderWithXp } from './OrderWithXp';
import type { ProductWithXp } from './ProductWithXp';
export type OrderWithXpOrderApprovalWithXpLineItemWithXpProductWithXpOrderReturnWithXpOrderReturnMessageSenderEventBody =
  {
    order?: OrderWithXp;
    approvals?: Array<OrderApprovalWithXp> | null;
    lineItems?: Array<LineItemWithXp> | null;
    products?: Array<ProductWithXp> | null;
    orderReturn?: OrderReturnWithXp;
  };

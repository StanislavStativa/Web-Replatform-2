/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemWithXp } from './LineItemWithXp';
import type { OrderApprovalWithXp } from './OrderApprovalWithXp';
import type { OrderWithXp } from './OrderWithXp';
import type { ProductWithXp } from './ProductWithXp';
import type { ShipmentItemWithXp } from './ShipmentItemWithXp';
import type { ShipmentWithXp } from './ShipmentWithXp';
export type OrderWithXpOrderApprovalWithXpLineItemWithXpProductWithXpShipmentWithXpShipmentItemWithXpShipmentCreatedMessageSenderEventBody =
  {
    order?: OrderWithXp;
    approvals?: Array<OrderApprovalWithXp> | null;
    lineItems?: Array<LineItemWithXp> | null;
    products?: Array<ProductWithXp> | null;
    shipment?: ShipmentWithXp;
    shipmentItems?: Array<ShipmentItemWithXp> | null;
  };

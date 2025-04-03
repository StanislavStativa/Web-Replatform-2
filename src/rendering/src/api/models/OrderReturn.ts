/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderReturnItem } from './OrderReturnItem';
import type { OrderStatus } from './OrderStatus';
export type OrderReturn = {
  id?: string | null;
  orderID?: string | null;
  paymentIDs?: Array<string> | null;
  status?: OrderStatus;
  dateCreated?: string | null;
  dateSubmitted?: string | null;
  dateApproved?: string | null;
  dateDeclined?: string | null;
  dateCanceled?: string | null;
  dateCompleted?: string | null;
  lastUpdated?: string;
  refundAmount?: number | null;
  comments?: string | null;
  itemsToReturn?: Array<OrderReturnItem> | null;
  xp?: any;
};

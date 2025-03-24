/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { OrderStatus } from './OrderStatus';
import type { User } from './User';
export type Order = {
  id?: string | null;
  fromUser?: User;
  fromCompanyID?: string | null;
  toCompanyID?: string | null;
  fromUserID?: string | null;
  billingAddressID?: string | null;
  billingAddress?: Address;
  shippingAddressID?: string | null;
  comments?: string | null;
  lineItemCount?: number;
  status?: OrderStatus;
  dateCreated?: string | null;
  dateSubmitted?: string | null;
  dateApproved?: string | null;
  dateDeclined?: string | null;
  dateCanceled?: string | null;
  dateCompleted?: string | null;
  lastUpdated?: string;
  subtotal?: number;
  shippingCost?: number;
  taxCost?: number;
  promotionDiscount?: number;
  currency?: string | null;
  total?: number;
  isSubmitted?: boolean;
  xp?: any;
};

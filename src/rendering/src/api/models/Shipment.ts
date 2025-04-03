/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
export type Shipment = {
  id?: string | null;
  buyerID?: string | null;
  shipper?: string | null;
  dateShipped?: string | null;
  dateDelivered?: string | null;
  trackingNumber?: string | null;
  cost?: number | null;
  ownerID?: string | null;
  xp?: any;
  account?: string | null;
  fromAddressID?: string | null;
  toAddressID?: string | null;
  fromAddress?: Address;
  toAddress?: Address;
};

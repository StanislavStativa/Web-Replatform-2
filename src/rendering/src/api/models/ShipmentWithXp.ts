/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressWithXp } from './AddressWithXp';
import type { ShipFromAddressWithXp } from './ShipFromAddressWithXp';
import type { ShipmentXp } from './ShipmentXp';
export type ShipmentWithXp = {
  id?: string | null;
  buyerID?: string | null;
  shipper?: string | null;
  dateShipped?: string | null;
  dateDelivered?: string | null;
  trackingNumber?: string | null;
  cost?: number | null;
  ownerID?: string | null;
  xp?: ShipmentXp;
  account?: string | null;
  fromAddressID?: string | null;
  toAddressID?: string | null;
  fromAddress?: ShipFromAddressWithXp;
  toAddress?: AddressWithXp;
};

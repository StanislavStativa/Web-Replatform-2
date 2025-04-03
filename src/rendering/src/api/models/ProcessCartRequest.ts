/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BuyerCreditCardDetail } from './BuyerCreditCardDetail';
import type { CustomerAddress } from './CustomerAddress';
export type ProcessCartRequest = {
  customerAddress?: CustomerAddress;
  buyerCreditCard?: BuyerCreditCardDetail;
  paymentType?: string | null;
};

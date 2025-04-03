/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntegrationEventConfigData } from './IntegrationEventConfigData';
import type { UserWithXp } from './UserWithXp';
export type AddToCartIEPayloadWithXp = {
  productID?: string | null;
  quantity?: number;
  buyerID?: string | null;
  buyerUser?: UserWithXp;
  sellerID?: string | null;
  environment?: string | null;
  orderCloudAccessToken?: string | null;
  configData?: IntegrationEventConfigData;
};

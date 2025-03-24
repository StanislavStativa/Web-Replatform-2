/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntegrationEventConfigData } from './IntegrationEventConfigData';
import type { OrderWorksheetWithXp } from './OrderWorksheetWithXp';
export type OrderCheckoutIEPayloadWithXp = {
  orderWorksheet?: OrderWorksheetWithXp;
  environment?: string | null;
  orderCloudAccessToken?: string | null;
  configData?: IntegrationEventConfigData;
};

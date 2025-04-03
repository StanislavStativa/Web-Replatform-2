/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderWorksheetWithXp } from './OrderWorksheetWithXp';
import type { PaymentWithXp } from './PaymentWithXp';
export type OrderConfirmation = {
  orderWorksheet?: OrderWorksheetWithXp;
  payments?: Array<PaymentWithXp> | null;
};

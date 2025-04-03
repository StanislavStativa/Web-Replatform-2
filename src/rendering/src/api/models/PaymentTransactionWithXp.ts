/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentTransactionXp } from './PaymentTransactionXp';
export type PaymentTransactionWithXp = {
  id?: string | null;
  type?: string | null;
  dateExecuted?: string;
  currency?: string | null;
  amount?: number | null;
  succeeded?: boolean;
  resultCode?: string | null;
  resultMessage?: string | null;
  xp?: PaymentTransactionXp;
};

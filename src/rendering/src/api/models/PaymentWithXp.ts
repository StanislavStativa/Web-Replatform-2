/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentTransactionWithXp } from './PaymentTransactionWithXp';
import type { PaymentType } from './PaymentType';
import type { PaymentXp } from './PaymentXp';
export type PaymentWithXp = {
  id?: string | null;
  type?: PaymentType;
  dateCreated?: string;
  creditCardID?: string | null;
  spendingAccountID?: string | null;
  description?: string | null;
  currency?: string | null;
  amount?: number | null;
  accepted?: boolean | null;
  orderReturnID?: string | null;
  xp?: PaymentXp;
  transactions?: Array<PaymentTransactionWithXp> | null;
};

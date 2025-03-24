/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Locale } from './Locale';
export type User = {
  id?: string | null;
  companyID?: string | null;
  username?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  termsAccepted?: string | null;
  active?: boolean;
  xp?: any;
  availableRoles?: Array<string> | null;
  locale?: Locale;
  dateCreated?: string | null;
  passwordLastSetDate?: string | null;
};

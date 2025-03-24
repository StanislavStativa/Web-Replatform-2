/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmarsysFields } from './EmarsysFields';
export type OCUserRequest = {
  id?: string | null;
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  addressFirstName?: string | null;
  addressLastName?: string | null;
  addressEmail?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  preferredStore?: string | null;
  preferredStoreID?: string | null;
  companyName?: string | null;
  tradeProfessions?: string | null;
  userType?: string | null;
  isMigrated?: boolean;
  isChildUser?: boolean;
  isEmailOptIn?: boolean;
  emarsysFields?: EmarsysFields;
  existingCustomerId?: string | null;
  parentCustomerId?: string | null;
  customerType?: string | null;
};

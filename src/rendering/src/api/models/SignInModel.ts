/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRole } from './ApiRole';
export type SignInModel = {
  userName?: string | null;
  password?: string | null;
  newPassword?: string | null;
  passwordChangeFlag?: boolean;
  roles?: Array<ApiRole> | null;
};

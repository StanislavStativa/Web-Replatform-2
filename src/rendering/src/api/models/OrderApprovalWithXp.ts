/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovalStatus } from './ApprovalStatus';
import type { UserWithXp } from './UserWithXp';
export type OrderApprovalWithXp = {
  allowResubmit?: boolean;
  approvalRuleID?: string | null;
  approvingGroupID?: string | null;
  status?: ApprovalStatus;
  dateCreated?: string;
  dateCompleted?: string | null;
  approver?: UserWithXp;
  comments?: string | null;
};

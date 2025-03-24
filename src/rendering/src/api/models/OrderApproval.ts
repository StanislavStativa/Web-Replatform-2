/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovalStatus } from './ApprovalStatus';
import type { User } from './User';
export type OrderApproval = {
  allowResubmit?: boolean;
  approvalRuleID?: string | null;
  approvingGroupID?: string | null;
  status?: ApprovalStatus;
  dateCreated?: string;
  dateCompleted?: string | null;
  approver?: User;
  comments?: string | null;
};

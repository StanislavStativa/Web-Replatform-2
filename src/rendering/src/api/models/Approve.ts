/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApproveRouteParams } from './ApproveRouteParams';
import type { OrderApprovalInfoOrderApproveRouteParamsObjectOrderApprovalInfoHttpMessage } from './OrderApprovalInfoOrderApproveRouteParamsObjectOrderApprovalInfoHttpMessage';
import type { OrderApprovalInfoOrderApproveRouteParamsObjectOrderHttpMessage } from './OrderApprovalInfoOrderApproveRouteParamsObjectOrderHttpMessage';
export type Approve = {
  route?: string | null;
  routeParams?: ApproveRouteParams;
  verb?: string | null;
  date?: string | null;
  logID?: string | null;
  userToken?: string | null;
  request?: OrderApprovalInfoOrderApproveRouteParamsObjectOrderApprovalInfoHttpMessage;
  response?: OrderApprovalInfoOrderApproveRouteParamsObjectOrderHttpMessage;
  configData?: any;
};

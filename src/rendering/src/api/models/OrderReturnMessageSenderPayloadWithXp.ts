/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageSenderXp } from './MessageSenderXp';
import type { MessageType } from './MessageType';
import type { OrderWithXpOrderApprovalWithXpLineItemWithXpProductWithXpOrderReturnWithXpOrderReturnMessageSenderEventBody } from './OrderWithXpOrderApprovalWithXpLineItemWithXpProductWithXpOrderReturnWithXpOrderReturnMessageSenderEventBody';
import type { UserWithXp } from './UserWithXp';
export type OrderReturnMessageSenderPayloadWithXp = {
  buyerID?: string | null;
  ocLogIdHeader?: string | null;
  environment?: string | null;
  userToken?: string | null;
  messageType?: MessageType;
  ccList?: Array<string> | null;
  recipient?: UserWithXp;
  configData?: MessageSenderXp;
  eventBody?: OrderWithXpOrderApprovalWithXpLineItemWithXpProductWithXpOrderReturnWithXpOrderReturnMessageSenderEventBody;
};

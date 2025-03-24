/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentWorkFormEventData } from './PaymentWorkFormEventData';
import type { PaymentWorkFormFieldMapping } from './PaymentWorkFormFieldMapping';
import type { PaymentWorkFormPayload } from './PaymentWorkFormPayload';
import type { SubmitAction } from './SubmitAction';
export type PaymentWorkFormPayloadModels = {
  formPayload?: PaymentWorkFormPayload;
  submitAction?: Array<SubmitAction> | null;
  fieldMappings?: PaymentWorkFormFieldMapping;
  eventData?: PaymentWorkFormEventData;
};

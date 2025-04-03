/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactUsFormPayload } from '../models/ContactUsFormPayload';
import type { PaymentWorkFormPayloadModels } from '../models/PaymentWorkFormPayloadModels';
import type { PaymentWorksFormEmailPayload } from '../models/PaymentWorksFormEmailPayload';
import type { ScheduleConsultationFormPayload } from '../models/ScheduleConsultationFormPayload';
import type { SignUpFormPayload } from '../models/SignUpFormPayload';
import type { UnSubscribeFormPayload } from '../models/UnSubscribeFormPayload';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmarsysService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysContactUsForm(requestBody?: ContactUsFormPayload): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/emarsys/contactusform',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysSignUpForm(requestBody?: SignUpFormPayload): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/emarsys/emailsignupform',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysUnSubscribeForm(
    requestBody?: UnSubscribeFormPayload
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/emarsys/unsubscribeform',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysScheduleConsultationForm(
    requestBody?: ScheduleConsultationFormPayload
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/emarsys/scheduleconsultationform',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysPaymentWorksFormEmail(
    requestBody?: PaymentWorksFormEmailPayload
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/emarsys/paymentWorksFormEmail',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysPaymentWorksform(
    requestBody?: PaymentWorkFormPayloadModels
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/emarsys/paymentWorksform',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
}

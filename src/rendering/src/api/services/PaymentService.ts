/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorizeRequest } from '../models/AuthorizeRequest';
import type { PaymentDetailRequest } from '../models/PaymentDetailRequest';
import type { PaymentRequest } from '../models/PaymentRequest';
import type { TokenizeRequest } from '../models/TokenizeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static paymentInitiatePayment(requestBody?: PaymentRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payment/initiatepayment',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static paymentGetRequestId(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/payment/getrequestid',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static paymentGetTokenize(requestBody?: TokenizeRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payment/gettokenize',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param isCheckout
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static paymentGetAuthorize(
    isCheckout?: boolean,
    requestBody?: AuthorizeRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payment/getauthorize',
      query: {
        isCheckout: isCheckout,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static paymentGetPaymentDetails(
    requestBody?: PaymentDetailRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payment/getpaymentdetails',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param referenceId
   * @returns any Success
   * @throws ApiError
   */
  public static paymentCheckAccountStatus(referenceId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/payment/checkaccountstatus',
      query: {
        referenceId: referenceId,
      },
    });
  }
}

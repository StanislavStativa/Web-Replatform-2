/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Approve } from '../models/Approve';
import type { Create } from '../models/Create';
import type { PreWebhookResponse } from '../models/PreWebhookResponse';
import type { Submit } from '../models/Submit';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static webhookHandleOrderApprove(requestBody?: Approve): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/webhook/orderapproved',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns PreWebhookResponse Success
   * @throws ApiError
   */
  public static webhookHandleAddressCreate(
    requestBody?: Create
  ): CancelablePromise<PreWebhookResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/webhook/createaddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static webhookHandleCartSubmit(requestBody?: Submit): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/webhook/savebasket',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
}

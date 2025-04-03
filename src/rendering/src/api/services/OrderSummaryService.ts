/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderSummaryService {
  /**
   * @param orderId
   * @returns any Success
   * @throws ApiError
   */
  public static orderSummaryGetOrderDetails(orderId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/orderSummary/getOrderDetails',
      query: {
        orderId: orderId,
      },
    });
  }
}

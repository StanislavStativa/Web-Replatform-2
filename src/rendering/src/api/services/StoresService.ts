/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoresService {
  /**
   * @param zipCode
   * @returns any Success
   * @throws ApiError
   */
  public static storesNearest(zipCode?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Stores/Nearest',
      query: {
        zipCode: zipCode,
      },
    });
  }
  /**
   * @param storeid
   * @returns any Success
   * @throws ApiError
   */
  public static storesGetMerchantId(storeid?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Stores/getmerchantId',
      query: {
        storeid: storeid,
      },
    });
  }
}

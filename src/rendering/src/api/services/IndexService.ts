/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IndexService {
  /**
   * @param adminPassword
   * @returns any Success
   * @throws ApiError
   */
  public static indexAddUpdateXpIndices(adminPassword?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/index/addUpdateXpIndices',
      query: {
        adminPassword: adminPassword,
      },
    });
  }
  /**
   * @param adminPassword
   * @returns any Success
   * @throws ApiError
   */
  public static indexDeleteXpIndices(adminPassword?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/index/deleteXpIndices',
      query: {
        adminPassword: adminPassword,
      },
    });
  }
}

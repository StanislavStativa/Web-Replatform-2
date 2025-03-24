/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebHookRequestModel } from '../models/WebHookRequestModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductSyncService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static productSyncCreateUpdateProduct(
    requestBody?: WebHookRequestModel
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/product/createupdateProduct',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param jobId
   * @returns any Success
   * @throws ApiError
   */
  public static productSyncGetJobStatus(jobId: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product/status/{jobId}',
      path: {
        jobId: jobId,
      },
    });
  }
}

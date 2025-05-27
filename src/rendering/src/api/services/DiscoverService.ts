/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscoverService {
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static discoverExportFeeds(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Discover/ExportFeeds',
    });
  }
  /**
   * @param jobId
   * @returns any Success
   * @throws ApiError
   */
  public static discoverGetJobStatus(jobId: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Discover/status/{jobId}',
      path: {
        jobId: jobId,
      },
    });
  }
}

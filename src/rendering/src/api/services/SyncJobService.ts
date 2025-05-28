/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SyncJobService {
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static syncJobImportStores(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/SyncJob/syncStores',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static syncJobImportAttributes(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/SyncJob/syncAttributes',
    });
  }
  /**
   * @param productIds
   * @returns any Success
   * @throws ApiError
   */
  public static syncJobImportProducts(productIds?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/SyncJob/syncProducts',
      query: {
        productIds: productIds,
      },
    });
  }
  /**
   * @param statusIds
   * @returns any Success
   * @throws ApiError
   */
  public static syncJobImportProductsWithStatus(statusIds?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/SyncJob/syncProductsWithStatus',
      query: {
        statusIds: statusIds,
      },
    });
  }
  /**
   * @param productIds
   * @returns any Success
   * @throws ApiError
   */
  public static syncJobImportProductPrices(productIds?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/SyncJob/syncProductPrices',
      query: {
        productIds: productIds,
      },
    });
  }
  /**
   * @param jobId
   * @returns any Success
   * @throws ApiError
   */
  public static syncJobGetJobStatus(jobId: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/SyncJob/status/{jobId}',
      path: {
        jobId: jobId,
      },
    });
  }
}

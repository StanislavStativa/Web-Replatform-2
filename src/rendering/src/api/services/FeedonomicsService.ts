/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedonomicsService {
  /**
   * @param token
   * @param format
   * @param skip
   * @param sku
   * @param take
   * @returns any Success
   * @throws ApiError
   */
  public static feedonomicsExportFeeds(
    token?: string,
    format: string = 'json',
    skip?: number,
    sku?: string,
    take?: number
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Feedonomics/ExportFeeds',
      query: {
        token: token,
        format: format,
        skip: skip,
        sku: sku,
        take: take,
      },
    });
  }
}

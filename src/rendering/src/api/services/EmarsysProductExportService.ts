/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmarsysProductExportService {
  /**
   * @param fileName
   * @param exportPath
   * @returns any Success
   * @throws ApiError
   */
  public static emarsysProductExportExportFeeds(
    fileName?: string,
    exportPath?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/EmarsysProductExport/ExportFeeds',
      query: {
        fileName: fileName,
        exportPath: exportPath,
      },
    });
  }
}

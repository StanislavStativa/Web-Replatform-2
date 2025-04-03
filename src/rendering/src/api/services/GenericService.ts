/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GenericService {
  /**
   * @param imageName
   * @returns any Success
   * @throws ApiError
   */
  public static genericGetImageAltText(imageName?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/generic/getalttext',
      query: {
        imageName: imageName,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static genericGetSiteSettings(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/generic/getsitesettings',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static genericGetRedirects(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/generic/getRedirects',
    });
  }
  /**
   * @param sourceUrl
   * @returns any Success
   * @throws ApiError
   */
  public static genericGetProductRedirect(sourceUrl?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/generic/getProductRedirect',
      query: {
        sourceUrl: sourceUrl,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static genericGetStaticData(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/generic/getStaticData',
    });
  }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductService {
  /**
   * @param itemPath
   * @returns any Success
   * @throws ApiError
   */
  public static productGetSitecoreItem(itemPath?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Product/GetSitecoreItem',
      query: {
        itemPath: itemPath,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static productGetPaymentOptions(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Product/GetPaymentOptions',
    });
  }
  /**
   * @param productId
   * @returns any Success
   * @throws ApiError
   */
  public static productGetProductAttributes(productId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Product/GetProductAttributes',
      query: {
        productId: productId,
      },
    });
  }
  /**
   * @param productId
   * @returns any Success
   * @throws ApiError
   */
  public static productGetProductBreadcrum(productId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Product/GetProductBreadcrum',
      query: {
        productId: productId,
      },
    });
  }
  /**
   * @param productName
   * @returns any Success
   * @throws ApiError
   */
  public static productGetProductItemDetails(productName?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Product/GetProductItemDetails',
      query: {
        productName: productName,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static productGetProductSitemaps(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Product/GetProductSitemaps',
    });
  }
}

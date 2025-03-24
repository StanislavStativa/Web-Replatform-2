/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerAddress } from '../models/CustomerAddress';
import type { UpdatedAddress } from '../models/UpdatedAddress';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AddressService {
  /**
   * @param pageSize
   * @param shipping
   * @param billing
   * @returns any Success
   * @throws ApiError
   */
  public static addressGetAddresses(
    pageSize?: number,
    shipping?: boolean,
    billing?: boolean
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/address/getAddresses',
      query: {
        PageSize: pageSize,
        Shipping: shipping,
        Billing: billing,
      },
    });
  }
  /**
   * @param addressId
   * @returns any Success
   * @throws ApiError
   */
  public static addressGetAddresses2(addressId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/address/getAddressById',
      query: {
        addressID: addressId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static addressAddAddress(requestBody?: CustomerAddress): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/address/addAddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static addressUpdateAddress(requestBody?: UpdatedAddress): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/address/updateAddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param addressId
   * @returns any Success
   * @throws ApiError
   */
  public static addressDeleteAddress(addressId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/address/deleteAddress',
      query: {
        addressId: addressId,
      },
    });
  }
}

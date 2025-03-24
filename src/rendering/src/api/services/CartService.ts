/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddToCartGuestRequest } from '../models/AddToCartGuestRequest';
import type { AddToCartRequest } from '../models/AddToCartRequest';
import type { CustomerAddress } from '../models/CustomerAddress';
import type { ProcessCartRequest } from '../models/ProcessCartRequest';
import type { ShippingDetails } from '../models/ShippingDetails';
import type { WECOValidatePartnerAddressRequest } from '../models/WECOValidatePartnerAddressRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartAddToCart(requestBody?: AddToCartRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Cart/AddToCart',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartWecoCreateBasket(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Cart/WECOCreateBasket',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartGetWecoBasket(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Cart/GetWECOBasket',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartGetCart(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Cart/GetCart',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartGetOrderSummary(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Cart/GetOrderSummary',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartGetCartListItems(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/Cart/GetCartListItems',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartGetGuestCartListItems(
    requestBody?: AddToCartGuestRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Cart/GuestCartListItems',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartRemoveAllCartItems(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/Cart/RemoveAllCartItems',
    });
  }
  /**
   * @param lineItemId
   * @returns any Success
   * @throws ApiError
   */
  public static cartRemoveCartLineItem(lineItemId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/Cart/RemoveCartLineItem',
      query: {
        lineItemId: lineItemId,
      },
    });
  }
  /**
   * @param lineItemId
   * @param quantity
   * @returns any Success
   * @throws ApiError
   */
  public static cartUpdateCartItemQuantity(
    lineItemId?: string,
    quantity?: number
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/Cart/UpdateCartItemQuantity',
      query: {
        lineItemId: lineItemId,
        quantity: quantity,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartValidatePartnerAddress(
    requestBody?: WECOValidatePartnerAddressRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Cart/ValidatePartnerAddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartSetBillingAddress(requestBody?: CustomerAddress): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/Cart/SetBillingAddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartSetShippingAddress(requestBody?: ShippingDetails): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/Cart/SetShippingAddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartUpdateWecoPartnerShippingAddress(
    requestBody?: ShippingDetails
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/Cart/UpdateWecoPartnerShippingAddress',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static cartProcessCart(requestBody?: ProcessCartRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Cart/ProcessCart',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static cartSubmitCart(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/Cart/SubmitCart',
    });
  }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddToCartIEPayloadWithXp } from '../models/AddToCartIEPayloadWithXp';
import type { AddToCartResponseWithXp } from '../models/AddToCartResponseWithXp';
import type { OpenIdConnectCreateUserResponse } from '../models/OpenIdConnectCreateUserResponse';
import type { OpenIDConnectIEPayloadWithXp } from '../models/OpenIDConnectIEPayloadWithXp';
import type { OpenIdConnectSyncUserResponse } from '../models/OpenIdConnectSyncUserResponse';
import type { OrderApprovedResponseWithXp } from '../models/OrderApprovedResponseWithXp';
import type { OrderCalculateResponseWithXp } from '../models/OrderCalculateResponseWithXp';
import type { OrderCheckoutIEPayloadWithXp } from '../models/OrderCheckoutIEPayloadWithXp';
import type { OrderReturnIEPayloadWithXp } from '../models/OrderReturnIEPayloadWithXp';
import type { OrderReturnResponse } from '../models/OrderReturnResponse';
import type { OrderSubmitForApprovalResponseWithXp } from '../models/OrderSubmitForApprovalResponseWithXp';
import type { OrderSubmitResponseWithXp } from '../models/OrderSubmitResponseWithXp';
import type { ShipEstimateResponseWithXp } from '../models/ShipEstimateResponseWithXp';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IntegrationEventService {
  /**
   * @param requestBody
   * @returns AddToCartResponseWithXp Success
   * @throws ApiError
   */
  public static integrationEventGetProductWithUnitPrice(
    requestBody?: AddToCartIEPayloadWithXp
  ): CancelablePromise<AddToCartResponseWithXp> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/addtocart',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OpenIdConnectCreateUserResponse Success
   * @throws ApiError
   */
  public static integrationEventCreateUserFromSso(
    requestBody?: OpenIDConnectIEPayloadWithXp
  ): CancelablePromise<OpenIdConnectCreateUserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/openidconnect/createuser',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OpenIdConnectSyncUserResponse Success
   * @throws ApiError
   */
  public static integrationEventUpdateUserFromSso(
    requestBody?: OpenIDConnectIEPayloadWithXp
  ): CancelablePromise<OpenIdConnectSyncUserResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/openidconnect/syncuser',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OrderReturnResponse Success
   * @throws ApiError
   */
  public static integrationEventCalculateOrderReturnRefund(
    requestBody?: OrderReturnIEPayloadWithXp
  ): CancelablePromise<OrderReturnResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/orderreturn/calculateorderreturn',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns ShipEstimateResponseWithXp Success
   * @throws ApiError
   */
  public static integrationEventEstimateShippingCosts(
    requestBody?: OrderCheckoutIEPayloadWithXp
  ): CancelablePromise<ShipEstimateResponseWithXp> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/ordercheckout/shippingrates',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OrderCalculateResponseWithXp Success
   * @throws ApiError
   */
  public static integrationEventRecalculatePricesAndTax(
    requestBody?: OrderCheckoutIEPayloadWithXp
  ): CancelablePromise<OrderCalculateResponseWithXp> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/ordercheckout/ordercalculate',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OrderSubmitResponseWithXp Success
   * @throws ApiError
   */
  public static integrationEventPostSubmitProcessing(
    requestBody?: OrderCheckoutIEPayloadWithXp
  ): CancelablePromise<OrderSubmitResponseWithXp> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/ordercheckout/ordersubmit',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OrderApprovedResponseWithXp Success
   * @throws ApiError
   */
  public static integrationEventPostApprovalProcessing(
    requestBody?: OrderCheckoutIEPayloadWithXp
  ): CancelablePromise<OrderApprovedResponseWithXp> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/ordercheckout/orderapproved',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns OrderSubmitForApprovalResponseWithXp Success
   * @throws ApiError
   */
  public static integrationEventPostSubmitForApprovalProcessing(
    requestBody?: OrderCheckoutIEPayloadWithXp
  ): CancelablePromise<OrderSubmitForApprovalResponseWithXp> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/integrationevent/ordercheckout/ordersubmitforapproval',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
}

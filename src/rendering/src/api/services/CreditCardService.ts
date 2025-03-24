/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PCISafeCardDetails } from '../models/PCISafeCardDetails';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CreditCardService {
  /**
   * @returns PCISafeCardDetails Success
   * @throws ApiError
   */
  public static creditCardListSavedCreditCards(): CancelablePromise<Array<PCISafeCardDetails>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/me/credit-cards',
    });
  }
  /**
   * @param requestBody
   * @returns PCISafeCardDetails Success
   * @throws ApiError
   */
  public static creditCardCreateSavedCard(
    requestBody?: PCISafeCardDetails
  ): CancelablePromise<PCISafeCardDetails> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/me/credit-cards',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param cardId
   * @returns PCISafeCardDetails Success
   * @throws ApiError
   */
  public static creditCardGetSavedCard(cardId: string): CancelablePromise<PCISafeCardDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/me/credit-cards/{cardID}',
      path: {
        cardID: cardId,
      },
    });
  }
  /**
   * @param cardId
   * @returns any Success
   * @throws ApiError
   */
  public static creditCardDeleteSavedCardASync(cardId: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/me/credit-cards/{cardID}',
      path: {
        cardID: cardId,
      },
    });
  }
}

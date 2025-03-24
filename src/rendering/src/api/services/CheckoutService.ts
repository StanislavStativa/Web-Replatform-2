/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderConfirmation } from '../models/OrderConfirmation';
import type { PaymentWithXp } from '../models/PaymentWithXp';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CheckoutService {
  /**
   * @param orderId
   * @param amount
   * @param cardDetailsSavedCardId
   * @param cardDetailsToken
   * @param cardDetailsCardHolderName
   * @param cardDetailsNumberLast4Digits
   * @param cardDetailsExpirationMonth
   * @param cardDetailsExpirationYear
   * @param cardDetailsCardType
   * @param saveCardForFutureUse
   * @returns PaymentWithXp Success
   * @throws ApiError
   */
  public static checkoutSetCreditCardPayment(
    orderId: string,
    amount?: number,
    cardDetailsSavedCardId?: string,
    cardDetailsToken?: string,
    cardDetailsCardHolderName?: string,
    cardDetailsNumberLast4Digits?: string,
    cardDetailsExpirationMonth?: string,
    cardDetailsExpirationYear?: string,
    cardDetailsCardType?: string,
    saveCardForFutureUse?: boolean
  ): CancelablePromise<PaymentWithXp> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/order/{orderID}/card-payment',
      path: {
        OrderID: orderId,
      },
      query: {
        Amount: amount,
        'CardDetails.SavedCardID': cardDetailsSavedCardId,
        'CardDetails.Token': cardDetailsToken,
        'CardDetails.CardHolderName': cardDetailsCardHolderName,
        'CardDetails.NumberLast4Digits': cardDetailsNumberLast4Digits,
        'CardDetails.ExpirationMonth': cardDetailsExpirationMonth,
        'CardDetails.ExpirationYear': cardDetailsExpirationYear,
        'CardDetails.CardType': cardDetailsCardType,
        SaveCardForFutureUse: saveCardForFutureUse,
      },
    });
  }
  /**
   * @param orderId
   * @returns OrderConfirmation Success
   * @throws ApiError
   */
  public static checkoutSubmitOrder(orderId: string): CancelablePromise<OrderConfirmation> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/order/{orderID}/submit',
      path: {
        orderID: orderId,
      },
    });
  }
}

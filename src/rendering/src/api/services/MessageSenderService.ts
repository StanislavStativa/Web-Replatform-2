/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderMessageSenderPayloadWithXp } from '../models/OrderMessageSenderPayloadWithXp';
import type { OrderReturnMessageSenderPayloadWithXp } from '../models/OrderReturnMessageSenderPayloadWithXp';
import type { SetPasswordMessageSenderPayloadWithXp } from '../models/SetPasswordMessageSenderPayloadWithXp';
import type { ShipmentCreatedMessageSenderPayloadWithXp } from '../models/ShipmentCreatedMessageSenderPayloadWithXp';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MessageSenderService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderNewUserInvitation(
    requestBody?: SetPasswordMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/NewUserInvitation',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderNewUserInvitation2(
    requestBody?: SetPasswordMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/ForgottenPassword',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderSubmitted',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted2(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderSubmittedForApproval',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted3(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderApproved',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted4(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderDeclined',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted5(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderSubmittedForYourApproval',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted6(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderSubmittedForYourApprovalHasBeenApproved',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderSubmitted7(
    requestBody?: OrderMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderSubmittedForYourApprovalHasBeenDeclined',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderShipmentCreated(
    requestBody?: ShipmentCreatedMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/ShipmentCreated',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnSubmitted',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted2(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnSubmittedForApproval',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted3(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnApproved',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted4(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnDeclined',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted5(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnSubmittedForYourApproval',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted6(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnSubmittedForYourApprovalHasBeenApproved',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted7(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnSubmittedForYourApprovalHasBeenDeclined',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static messageSenderOrderReturnSubmitted8(
    requestBody?: OrderReturnMessageSenderPayloadWithXp
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/messagesender/OrderReturnCompleted',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
}

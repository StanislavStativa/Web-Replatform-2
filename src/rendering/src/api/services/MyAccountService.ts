/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoicePaymentRequest } from '../models/InvoicePaymentRequest';
import type { WECODownloadDocRequest } from '../models/WECODownloadDocRequest';
import type { WECOFilterRequest } from '../models/WECOFilterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MyAccountService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetOrders(requestBody?: WECOFilterRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/GetOrders',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param projectId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetOrderDetail(projectId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetOrderDetail',
      query: {
        projectId: projectId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetQuotes(requestBody?: WECOFilterRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/GetQuotes',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param quotationId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetQuoteDetail(quotationId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetQuoteDetail',
      query: {
        quotationId: quotationId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetSelectionSheets(
    requestBody?: WECOFilterRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/GetSelectionSheets',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param selectionSheetId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetSelectionSheetDetail(
    selectionSheetId?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetSelectionSheetDetail',
      query: {
        selectionSheetId: selectionSheetId,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetRewardSummary(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetRewardSummary',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetRewardStatements(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetRewardStatements',
    });
  }
  /**
   * @param rewardId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetRewardDetails(rewardId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetRewardDetails',
      query: {
        rewardId: rewardId,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetMyProjects(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetMyProjects',
    });
  }
  /**
   * @param projectId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetProjectDetail(projectId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetProjectDetail',
      query: {
        projectId: projectId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountSearchForInvoices(
    requestBody?: WECOFilterRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/SearchForInvoices',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountPayOpenInvoiceBySnapPay(
    requestBody?: InvoicePaymentRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/PayOpenInvoiceBySnapPay',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetBillingHistory(
    requestBody?: WECOFilterRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/GetBillingHistory',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param payOpenInvoices
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountPaymentCreditMemoHistory(
    payOpenInvoices?: boolean,
    requestBody?: WECOFilterRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/PaymentCreditStatements',
      query: {
        payOpenInvoices: payOpenInvoices,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetStatements(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetStatements',
    });
  }
  /**
   * @param documentTypeId
   * @param documentId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetDocumentHeaderPartner(
    documentTypeId?: string,
    documentId?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetDocumentHeaderPartner',
      query: {
        documentTypeId: documentTypeId,
        documentId: documentId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountDownloadDoc(requestBody?: WECODownloadDocRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/myaccount/DownloadDoc',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param documentTypeId
   * @returns any Success
   * @throws ApiError
   */
  public static myAccountGetDocumentFilters(documentTypeId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/myaccount/GetDocumentFilters',
      query: {
        documentTypeId: documentTypeId,
      },
    });
  }
}

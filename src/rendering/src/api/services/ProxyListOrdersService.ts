/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListFilter } from '../models/ListFilter';
import type { OrderListPage } from '../models/OrderListPage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProxyListOrdersService {
  /**
   * @param search
   * @param searchOn
   * @param sortBy
   * @param page
   * @param pageSize
   * @param filters
   * @returns OrderListPage Success
   * @throws ApiError
   */
  public static proxyListOrdersListOrdersForBillingAddress(
    search?: string,
    searchOn?: string,
    sortBy?: Array<string>,
    page?: number,
    pageSize?: number,
    filters?: Array<ListFilter>
  ): CancelablePromise<OrderListPage> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/proxy/orders/for/my/location',
      query: {
        Search: search,
        SearchOn: searchOn,
        SortBy: sortBy,
        Page: page,
        PageSize: pageSize,
        Filters: filters,
      },
    });
  }
}

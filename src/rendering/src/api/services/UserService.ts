/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanyUserData } from '../models/CompanyUserData';
import type { ContactEmailModel } from '../models/ContactEmailModel';
import type { ContactPhoneModel } from '../models/ContactPhoneModel';
import type { OcUserPersonalData } from '../models/OcUserPersonalData';
import type { OCUserRequest } from '../models/OCUserRequest';
import type { WECOUpdateCustomerData } from '../models/WECOUpdateCustomerData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static userCreateCustomer(requestBody?: OCUserRequest): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/createCustomer',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static userGetPersonalData(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/GetPersonalData',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static userChangePersonalData(requestBody?: OcUserPersonalData): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/user/ChangePersonalData',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static userCreateNewUser(requestBody?: CompanyUserData): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/CreateNewUser',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static userGetCustomerUserList(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user/GetCustomerUserList',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static userUpdateCustomerData(
    requestBody?: WECOUpdateCustomerData
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/user/UpdateCustomerData',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param email
   * @returns any Success
   * @throws ApiError
   */
  public static userDeleteUser(email?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/user/DeleteUser',
      query: {
        email: email,
      },
    });
  }
  /**
   * @param email
   * @returns any Success
   * @throws ApiError
   */
  public static userLockUser(email?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/LockUser',
      query: {
        email: email,
      },
    });
  }
  /**
   * @param email
   * @returns any Success
   * @throws ApiError
   */
  public static userUnlockUser(email?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/user/UnlockUser',
      query: {
        email: email,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static userIsPhoneAlreadyExist(requestBody?: ContactPhoneModel): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/IsPhoneAlreadyExist',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static userIsEmailAlreadyExist(requestBody?: ContactEmailModel): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/IsEmailAlreadyExist',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param page
   * @param pageSize
   * @returns any Success
   * @throws ApiError
   */
  public static userDeleteMeCreditCardForAllUser(
    page?: number,
    pageSize?: number
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/DeleteMeCreditCardForAllUser',
      query: {
        page: page,
        pageSize: pageSize,
      },
    });
  }
  /**
   * @param formData
   * @returns any Success
   * @throws ApiError
   */
  public static userCustomerMigration(formData?: { file?: Blob }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/user/CustomerMigration',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
}

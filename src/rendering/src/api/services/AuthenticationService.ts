/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { SignInModel } from '../models/SignInModel';
import type { UserStatusRequest } from '../models/UserStatusRequest';
import type { WECOCustomerRequest } from '../models/WECOCustomerRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetWecoUser(
    requestBody?: WECOCustomerRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/GetWecoUser',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetUserStatus(
    requestBody?: UserStatusRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/GetUserStatus',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param token
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationUserAuthentication(token?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/UserAuthentication',
      query: {
        token: token,
      },
    });
  }
  /**
   * @param token
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetTokenData(token?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/GetTokenData',
      query: {
        token: token,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetDecryptedPassword(
    requestBody?: SignInModel
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/GetDecryptedPassword',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetEncryptPassword(
    requestBody?: SignInModel
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/GetEncryptPassword',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param token
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationSignIn(
    token?: string,
    requestBody?: SignInModel
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/signIn',
      query: {
        token: token,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param userName
   * @param userPassword
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationWecoSignIn(
    userName?: string,
    userPassword?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/WECOSignIn',
      query: {
        userName: userName,
        userPassword: userPassword,
      },
    });
  }
  /**
   * @param userName
   * @param userPassword
   * @param noPasswordCheck
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetAuthToken(
    userName?: string,
    userPassword?: string,
    noPasswordCheck: boolean = false
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/GetAuthToken',
      query: {
        userName: userName,
        userPassword: userPassword,
        noPasswordCheck: noPasswordCheck,
      },
    });
  }
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationGetCustomerSet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/GetCustomerSet',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationAccountActivation(
    requestBody?: ForgotPasswordRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/AccountActivation',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationForgotPassword(
    requestBody?: ForgotPasswordRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/ForgotPassword',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param token
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static authenticationResetPassword(
    token?: string,
    requestBody?: ResetPasswordRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/ResetPassword',
      query: {
        token: token,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
}

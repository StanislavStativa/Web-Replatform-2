/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WECOAddProjectItemRequest } from '../models/WECOAddProjectItemRequest';
import type { WECOUpdateProjectItemRequest } from '../models/WECOUpdateProjectItemRequest';
import type { WECOUpdateProjectRequest } from '../models/WECOUpdateProjectRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectService {
  /**
   * @returns any Success
   * @throws ApiError
   */
  public static projectCreateNewProject(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/project/CreateNewProject',
    });
  }
  /**
   * @param basketId
   * @param projectId
   * @param projectName
   * @returns any Success
   * @throws ApiError
   */
  public static projectAddProjectName(
    basketId?: string,
    projectId?: string,
    projectName?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/project/AddProjectName',
      query: {
        basketId: basketId,
        projectId: projectId,
        projectName: projectName,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static projectUpdateProject(
    requestBody?: WECOUpdateProjectRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/project/UpdateProject',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static projectAddItemToProject(
    requestBody?: WECOAddProjectItemRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/project/AddItemToProject',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param basketId
   * @returns any Success
   * @throws ApiError
   */
  public static projectGetProjectItemDetails(basketId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/project/GetProjectItemDetails',
      query: {
        basketId: basketId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  public static projectEditProjectItems(
    requestBody?: WECOUpdateProjectItemRequest
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/project/EditProjectItems',
      body: requestBody,
      mediaType: 'application/json-patch+json',
    });
  }
  /**
   * @param basketId
   * @param basketItemGuid
   * @returns any Success
   * @throws ApiError
   */
  public static projectDeleteProjectItems(
    basketId?: string,
    basketItemGuid?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/project/DeleteProjectItems',
      query: {
        basketId: basketId,
        basketItemGuid: basketItemGuid,
      },
    });
  }
  /**
   * @param basketId
   * @returns any Success
   * @throws ApiError
   */
  public static projectSaveProject(basketId?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/project/SaveProject',
      query: {
        basketId: basketId,
      },
    });
  }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntegrationEventConfigData } from './IntegrationEventConfigData';
import type { OpenIdConnect } from './OpenIdConnect';
import type { OpenIdConnectTokenResponse } from './OpenIdConnectTokenResponse';
import type { UserWithXp } from './UserWithXp';
export type OpenIDConnectIEPayloadWithXp = {
  existingUser?: UserWithXp;
  openIdConnect?: OpenIdConnect;
  tokenResponse?: OpenIdConnectTokenResponse;
  environment?: string | null;
  orderCloudAccessToken?: string | null;
  configData?: IntegrationEventConfigData;
};

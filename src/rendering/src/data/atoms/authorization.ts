import { ANONYMOUS } from '@/constants/user';
import { getTokens, isTokenExpired, parseJwt } from '@/utils/authUtils';
import { atom } from 'jotai';
import { ApiRole, DecodedToken } from 'ordercloud-javascript-sdk';

interface AuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  decodedAccessToken?: DecodedToken;
  assignedRoles: ApiRole[];
}

export function checkIsLoggedIn(): AuthState {
  const { accessToken, refreshToken } = getTokens();

  if (isTokenExpired(accessToken)) {
    return {
      isAuthenticated: false,
      accessToken,
      refreshToken,
      decodedAccessToken: {} as DecodedToken,
      assignedRoles: [],
    };
  }
  const decodedAccessToken = parseJwt(accessToken as string);
  return {
    accessToken,
    refreshToken,
    isAuthenticated: decodedAccessToken.usr !== ANONYMOUS,
    decodedAccessToken,
    // if only one role assigned then the decodedtoken.role
    // will be a string else it will be a proper array
    assignedRoles: (typeof decodedAccessToken.role === 'string'
      ? [decodedAccessToken.role]
      : decodedAccessToken.role) as ApiRole[],
  };
}

export const authorizationAtom = atom(checkIsLoggedIn());

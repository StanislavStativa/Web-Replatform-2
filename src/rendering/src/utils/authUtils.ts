import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from 'ordercloud-javascript-sdk';
import { NextApiRequest } from 'next';
import crypto from 'crypto'; // Correct import for TypeScript or ES6
import LogRocket from 'logrocket';
import {
  AUTH_TOKEN,
  CAN_CREATE_USER,
  CUST_ID,
  CUST_NUM,
  IS_NET_PRO,
  IS_PROUSER,
  PRICE_GP,
  REFRESH_TOKEN,
  USR_EMAIL,
  USR_PREFERRED_STORE,
  WECO_AUTH_TOKEN,
  WECO_REFRESH_TOKEN,
} from 'src/config';
import { ANONYMOUS } from '@/constants/user';

export const setToken = (accessToken: string, refreshToken?: string) => {
  Cookies.set(AUTH_TOKEN, accessToken);
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN, refreshToken);
  }
};

export const getAccessToken = () => Cookies.get(AUTH_TOKEN);

export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN);

export const getTokens = () => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
});

export const clearTokens = () => {
  Cookies.remove(AUTH_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
  Cookies.remove(WECO_AUTH_TOKEN);
  Cookies.remove(WECO_REFRESH_TOKEN);
  Cookies.remove(CAN_CREATE_USER);
  Cookies.remove(IS_NET_PRO);
  Cookies.remove(USR_PREFERRED_STORE);
  Cookies.remove(CUST_ID);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('logout', JSON.stringify(true));
      window.localStorage.removeItem(USR_EMAIL);
    } catch (error) {
      console.error(`Error setting localStorage:`, error);
    }
  }
  LogRocket?.startNewSession();
};

export const parseJwt = (token: string): DecodedToken => jwtDecode<DecodedToken>(token);

export function isTokenExpired(token?: string): boolean {
  if (!token) {
    return true;
  }
  const decodedToken = parseJwt(token);
  const currentSeconds = Date.now() / 1000;
  const currentSecondsWithBuffer = currentSeconds - 10;
  return decodedToken.exp < currentSecondsWithBuffer;
}

export const getTokenFromHeaders = (req: NextApiRequest) =>
  req.headers.authorization?.replace('Bearer ', '');

export const clearUserDetails = () => {
  Cookies.remove(CUST_NUM);
  Cookies.remove(IS_PROUSER);
  Cookies.remove(PRICE_GP);
};

export const checkAnonymousAndRefreshToken = async (): Promise<boolean> => {
  const token = Cookies.get(AUTH_TOKEN) ?? '';
  const decodedToken = parseJwt(token);
  const isAnonymous = decodedToken?.usr === ANONYMOUS;

  // Check if the user is anonymous
  if (!isAnonymous) {
    return false; // Early return if the user is not anonymous
  }

  // Retrieve nbf (creation time) and expiry time from the decoded token
  const unixTimestamp = Math.floor(Date.now() / 1000);
  const expiryTime = decodedToken?.exp ? decodedToken.exp : null; // 'exp' in seconds

  // Check if nbf or expiry time is unavailable
  if (expiryTime === null) {
    return false; // Return false if either is missing
  }

  // Compare nbf with timeBeforeExpiry
  if (unixTimestamp - 10000 >= expiryTime) {
    return true; // Token should be refreshed if nbf is greater than or equal to the timeBeforeExpiry
  }

  return false; // No refresh needed
};
export const checkTokenAndRefreshToken = async (): Promise<boolean> => {
  const token = Cookies.get(AUTH_TOKEN) ?? '';
  const decodedToken = parseJwt(token);
  const isNtAnonymous = decodedToken?.usr !== ANONYMOUS;

  // Check if the user is anonymous
  if (!isNtAnonymous) {
    return false; // Early return if the user is not anonymous
  }

  // Retrieve nbf (creation time) and expiry time from the decoded token
  const unixTimestamp = Math.floor(Date.now() / 1000);
  const expiryTime = decodedToken?.exp ? decodedToken.exp : null; // 'exp' in seconds

  // Check if nbf or expiry time is unavailable
  if (expiryTime === null) {
    return false; // Return false if either is missing
  }

  // Compare nbf with timeBeforeExpiry
  if (unixTimestamp >= expiryTime) {
    return true; // Token should be refreshed if nbf is greater than or equal to the timeBeforeExpiry
  }

  return false; // No refresh needed
};

const keyEnv = process.env.NEXT_PUBLIC_CRYPTO_KEY;
const ivEnv = process.env.NEXT_PUBLIC_CRYPTO_IV;

export function encryptPassword(password: string): string {
  // Shared secret key and IV (use 256-bit key and 16-byte IV)
  const key = keyEnv && Buffer?.from(keyEnv as string); // Replace with your secure key
  const iv = ivEnv && Buffer?.from(ivEnv as string); // Replace with your secure IV
  if (!key || !iv) {
    // If key or IV is not present, return the password as it is
    return password;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cipher = crypto?.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher?.update(password, 'utf8', 'base64');
    encrypted += cipher?.final('base64');
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return password; // Return password unencrypted if an error occurs
  }
}

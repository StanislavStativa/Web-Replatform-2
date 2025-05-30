import { AUTH_TOKEN } from '@/config';
import { handleErrors } from '@/utils/request';
import Cookies from 'js-cookie';
import { Auth, OrderCloudError } from 'ordercloud-javascript-sdk';
import { OpenAPI } from '@/api';
// Add a flag to ensure the timer is only started once
let timerStarted = false;
export const anonymousSignIn = async () => {
  if (timerStarted) {
    return;
  }
  timerStarted = true;
  console.time('anonymousSignIn'); // Start the timer
  try {
    const data = await Auth.Anonymous(process?.env?.NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID as string);
    const token = data.access_token;
    OpenAPI.HEADERS = {
      Authorization: `Bearer ${token}`,
    };
    Cookies.set(AUTH_TOKEN, token);

    console.timeEnd('anonymousSignIn'); // End the timer
    return {
      status: 200,
      accessToken: data.access_token,
    };
  } catch (error) {
    console.timeEnd('anonymousSignIn'); // End the timer in case of an error
    return handleErrors(error as OrderCloudError);
  } finally {
    timerStarted = false;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const data = await Auth.RefreshToken(
      refreshToken,
      process?.env?.NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID as string
    );
    Cookies.set(AUTH_TOKEN, data.access_token);
    return {
      status: 200,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    return handleErrors(error as OrderCloudError);
  }
};

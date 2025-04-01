import React, { useEffect, useState } from 'react';
import { FormErrorMessages, UserAuthenticationProps } from './UserAuthentication.type';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useI18n } from 'next-localization';
import { userAuthSchema } from './UserAuthSchema';
import InputFormField from './InputFormField';
import Button from '@/core/atoms/Button/Button';
import { IoMdCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { SIZE } from '@/utils/constants';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SignInModel } from '@/api/models/SignInModel';
import { checkAnonymousAndRefreshToken, encryptPassword } from '@/utils/authUtils';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';
import Cookies from 'js-cookie';
import {
  DIST_CHNL,
  AUTH_TOKEN,
  CUST_ID,
  CUST_NUM,
  IS_PROUSER,
  PRICE_GP,
  SALE_ORG,
  SITE_ID,
  WECO_AUTH_TOKEN,
  WECO_REFRESH_TOKEN,
  CUST_NAME,
  CAN_CREATE_USER,
  IS_NET_PRO,
  USR_PREFERRED_STORE,
  event,
  USR_EMAIL,
  REFRESH_TOKEN,
} from '@/config';
import useLocalStorage from '@/utils/useLocalStorage';
import { ForgotPasswordRequest, OpenAPI } from '@/api';
import { useSetAtom } from 'jotai';
import { authorizationAtom } from '@/data/atoms/authorization';
import { triggerEvent } from '@/utils/eventTracking';
import { FaRegLightbulb } from 'react-icons/fa';
import LogRocket from 'logrocket';

const UserAuthentication = (props: UserAuthenticationProps) => {
  const {
    Title,
    Icon,
    CTALabel,
    SubTitle,
    Description,
    SecondaryCTATitle,
    HomeLink,
    EmarsysDetails,
    SuccessMessage,
  } = props?.rendering?.fields || {};
  const IsPasswordReset = Boolean(props?.rendering?.params?.IsPasswordReset);
  const { t } = useI18n();
  const { setData, removeData } = useLocalStorage();

  const router = useRouter();
  const setAuthorizationAtom = useSetAtom(authorizationAtom);
  const [anoymusToken, setAnoymusToken] = useState<undefined | string>(
    Cookies.get(AUTH_TOKEN) ?? undefined
  );
  const [isPasswordModal, setIsPasswordModal] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [authTokenError, setAuthTokenError] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isResend, setIsResend] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [anyoymusLoad, setAnoymousLoad] = useState<boolean>(true);
  const [passwordValidation, setPasswordValidation] = useState({
    isTenChar: false,
    isUpperCase: false,
    isLowerCase: false,
    hasDigitOrSpecialChar: false,
  });

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const { mutate: checkUserAuthToken, isPending } = useMutation({
    mutationFn: async (token: string) => {
      await anonymousSignIn();
      return AuthenticationService.authenticationUserAuthentication(token);
    },
    onSuccess: (data) => {
      if (
        IsPasswordReset &&
        data?.ChangePasswordRequired &&
        data?.WECOToken?.accessToken &&
        data?.WECOToken?.accessToken !== ''
      ) {
        setUserEmail(data?.CustomerEmail);
        setIsPasswordModal(true);
        setIsPasswordChanged(data?.PasswordChangeFlag);
      } else if (
        data?.ChangePasswordRequired &&
        data?.TokenResponse &&
        data?.TokenResponse?.AccessToken !== ''
      ) {
        setUserEmail(data?.CustomerEmail);
        setIsPasswordModal(true);
        setIsPasswordChanged(data?.PasswordChangeFlag);
      } else {
        setUserEmail(data?.CustomerEmail);
        setAuthTokenError(true);
      }
    },
    onError: () => {
      setAuthTokenError(true);
    },
  });
  const { mutate: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async ({ token, requestBody }: { token?: string; requestBody?: SignInModel }) => {
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }
      return AuthenticationService.authenticationSignIn(token, requestBody);
    },
    onSuccess: (data) => {
      if (data && data?.TokenResponse && data?.TokenResponse?.AccessToken !== '') {
        setIsNavigating(true);
        setData(USR_EMAIL, data?.CustomerEmail);
        const { AccessToken } = data?.TokenResponse || {};
        const { accessToken, refreshToken } = data?.WECOToken || {};
        Cookies.set(CAN_CREATE_USER, data?.CanCreateCompanyUsers);

        Cookies.set(USR_PREFERRED_STORE, data?.PreferredStore);

        if (AccessToken) {
          Cookies.set(AUTH_TOKEN, AccessToken);
          OpenAPI.HEADERS = {
            Authorization: `Bearer ${AccessToken}`,
          };
        }
        if (accessToken) {
          Cookies.set(WECO_AUTH_TOKEN, accessToken);
          OpenAPI.HEADERS = {
            wckoToken: `${accessToken}`,
          };
        }
        if (refreshToken) {
          Cookies.set(WECO_REFRESH_TOKEN, refreshToken);
        }

        if (data?.SiteId) Cookies.set(SITE_ID, data.SiteId);
        if (data?.CustomerId) Cookies.set(CUST_ID, data.CustomerId);
        if (data?.CustomerNumber) Cookies.set(CUST_NUM, data.CustomerNumber);
        if (data?.PricingGroupTier) Cookies.set(PRICE_GP, data.PricingGroupTier);
        if (data?.IsProUser) Cookies.set(IS_PROUSER, data.IsProUser);
        if (data?.TermsOfPayment) Cookies.set(IS_NET_PRO, data.TermsOfPayment);
        if (data?.SalesOrganization) Cookies.set(SALE_ORG, data.SalesOrganization);
        if (data?.DistributionChannel) Cookies.set(DIST_CHNL, data.DistributionChannel);
        if (data?.CustomerName) Cookies.set(CUST_NAME, data.CustomerName);

        setAuthorizationAtom({ isAuthenticated: true, assignedRoles: [] });

        triggerEvent({
          event: event.LOGIN,
          userId: data?.CustomerNumber,
        });
        if (typeof window !== 'undefined' && 'rfk' in window) {
          window.rfk.push({
            value: {
              context: {
                user: {
                  id: data?.CustomerNumber,
                  email: data?.CustomerEmail,
                  fbid: '',
                  eid: '',
                },
              },
            },
            type: 'user',
            name: 'login',
          });
        }
        router.replace(HomeLink?.value?.href || '/');
      } else {
        setShowErrorMsg(true);
      }
    },
    onError: () => {
      setAuthTokenError(true);
      setIsPasswordModal(false);
      // setShowErrorMsg(true);
    },
  });

  const { mutate: resendVerification, isPending: resendPending } = useMutation({
    mutationFn: async (requestBody?: ForgotPasswordRequest) => {
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }
      return AuthenticationService.authenticationAccountActivation(requestBody);
    },
    onSuccess: () => {
      setIsResend(true);
    },
    onError: () => {
      setShowErrorMsg(true);
    },
  });
  const { mutate: forgotMutation, isPending: forgotPending } = useMutation({
    mutationFn: async (ForgotPassword: ForgotPasswordRequest) => {
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }
      return AuthenticationService.authenticationForgotPassword(ForgotPassword);
    },
    onSuccess: () => {
      setIsResend(true);
    },
    onError: () => {
      setShowErrorMsg(true);
    },
  });

  const errorMessages: FormErrorMessages = {
    Error_Required_NewPassword: t('Error_Required_NewPassword'),
    Error_Passwordlength: t('Error_Passwordlength'),
    Error_passwords_do_not_match: t('Error_CheckPassword'),
    Error_ExistingPassword: t('Error_ExistingPassword'),
    Error_Required_RepeatPassword: t('Error_Required_RepeatPassword'),
  };
  const formMethods = useForm({
    resolver: yupResolver(userAuthSchema(errorMessages)),
    defaultValues: {
      userName: '',
      password: '',
      repeatPassword: '',
      rememberMe: false,
      roles: [25, 55],
    },
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });
  const watchNewPassword = formMethods.watch('password');
  const onSubmit = formMethods.handleSubmit((data) => {
    setShowErrorMsg(false);
    signIn({
      token: userToken,
      requestBody: {
        userName: userEmail,
        password: '',
        newPassword: encryptPassword(data?.password),
        roles: data?.roles,
        passwordChangeFlag: isPasswordChanged,
      },
    });
  });

  const handleResendVerify = () => {
    const emarsysEventID =
      EmarsysDetails?.fields?.SubmitAction?.[0]?.fields?.EmarsysAdditionalProperty?.value ?? '';
    const parsedEmarsysEvent = emarsysEventID && JSON.parse(emarsysEventID);
    if (IsPasswordReset) {
      forgotMutation({
        email: userEmail,
        forgotPasswordFormModels: {
          fieldMappings: {
            emailFieldId: EmarsysDetails?.fields?.EmailFieldId?.value,
          },
          formPayload: {
            email: userEmail,
          },
          submitAction: {
            emarsysEventID: parsedEmarsysEvent?.EmarsysEventID,
            submitToEmailAddress: userEmail,
          },
        },
      });
    } else {
      resendVerification({
        email: userEmail,
        forgotPasswordFormModels: {
          fieldMappings: {
            emailFieldId: EmarsysDetails?.fields?.EmailFieldId?.value,
          },
          formPayload: {
            email: userEmail,
          },
          submitAction: {
            emarsysEventID: parsedEmarsysEvent?.EmarsysEventID,
            submitToEmailAddress: userEmail,
          },
        },
      });
    }
  };

  useEffect(() => {
    const token = router?.query?.token;
    if (authToken && authToken !== undefined && token && token !== '') {
      checkUserAuthToken(token as string);
      setUserToken(token as string);
    }
  }, [router?.query?.token, authToken, checkUserAuthToken]);

  useEffect(() => {
    if (authToken === undefined) {
      setAnoymousLoad(false);
      setAuthToken(anoymusToken);
    }
  }, [anoymusToken, authToken]);
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedToken = Cookies.get(AUTH_TOKEN);
      if (updatedToken !== anoymusToken) {
        setAnoymusToken(updatedToken ?? undefined);
      }
    }, 500); // Poll every 500ms or an appropriate interval for your app

    return () => clearInterval(interval); // Clean up on unmount
  }, [anoymusToken]);

  useEffect(() => {
    const conditions = {
      isTenChar: watchNewPassword?.length >= 10,
      isUpperCase: /[A-Z]/.test(watchNewPassword),
      isLowerCase: /[a-z]/.test(watchNewPassword),
      hasDigitOrSpecialChar: /[0-9!@#$%^&*]/.test(watchNewPassword),
    };

    setPasswordValidation(conditions);
  }, [watchNewPassword]);

  useEffect(() => {
    removeData(USR_EMAIL);
    setAuthorizationAtom({ isAuthenticated: false, assignedRoles: [] });
    Cookies.remove(REFRESH_TOKEN);
    Cookies.remove(WECO_AUTH_TOKEN);
    Cookies.remove(WECO_REFRESH_TOKEN);
    Cookies.remove(CAN_CREATE_USER);
    Cookies.remove(IS_NET_PRO);
    Cookies.remove(USR_PREFERRED_STORE);
    Cookies.remove(CUST_ID);
    setTimeout(() => {
      LogRocket?.startNewSession();
    }, 1000);
  }, []);
  const isAllPassTrue = () => {
    return Object.values(passwordValidation).every((value) => value === true);
  };
  return (
    <section
      className="container mx-auto flex justify-center px-5 md:px-10 min-h-550"
      id={props?.rendering?.uid}
    >
      {(isPending || isSignInPending || resendPending || forgotPending || anyoymusLoad) && (
        <LoaderSpinner />
      )}
      {authTokenError === true && isNavigating === false && (
        <div className="w-650 pt-8 pb-14 md:pt-14 md:pb-16 flex flex-col gap-y-2">
          <div className="pt-2">
            {showErrorMsg && (
              <NotificationMessage isCloseable onCancel={() => setShowErrorMsg(false)} />
            )}
          </div>
          {isResend && (
            <div className="flex items-center gap-x-1 bg-light-green container w-full mx-1 p-3 ">
              <FaRegLightbulb color="green" />
              <RichText field={SuccessMessage} className="" />
            </div>
          )}
          <div className="text-center flex flex-col gap-y-2 md:gap-y-6">
            <Text field={SubTitle} tag={'h2'} className="text-dark-gray md:lato-h1" />
            <Text field={Description} className="max-w-lg mx-auto" />
            <div className="flex justify-center mt-4">
              <Button
                variant={ButtonVariant?.BLACK}
                size={SIZE.LARGE}
                className={`w-full md:max-w-112 ${resendPending || forgotPending || isResend ? 'opacity-55 hover:opacity-55 hover:bg-dark-gray' : ''}`}
                isCTATextInCaps="1"
                disabled={resendPending || forgotPending || isResend}
                onClick={handleResendVerify}
              >
                {SecondaryCTATitle?.value}
              </Button>
            </div>
          </div>
        </div>
      )}
      {isPasswordModal && isNavigating === false && (
        <div className="grid grid-cols-1 md:grid-cols-12 justify-center pt-8 pb-14 md:pt-14 md:pb-16">
          <div className="col-span-1 md:col-span-12 md:col-start-1 flex flex-col gap-y-4 rounded-xl border border-gray-300 pt-11 pb-13 px-4 md:px-9 bg-white">
            <div className="w-full">
              <div className="flex items-center">
                <div className="hidden md:block w-11 h-11 mr-10">
                  <Image field={Icon} />
                </div>
                <Text tag={'h2'} className="text-left text-xl font-semibold" field={Title} />
              </div>
              <div className="pt-2">
                {showErrorMsg && (
                  <NotificationMessage isCloseable onCancel={() => setShowErrorMsg(false)} />
                )}
              </div>
            </div>
            <FormProvider {...formMethods}>
              <div className="grid grid-cols-1 md:grid-cols-12">
                <form
                  onSubmit={onSubmit}
                  className="col-span-1 md:col-span-5 md:col-start-2 flex flex-col gap-y-4"
                >
                  <div className="min-w-60 md:min-w-387">
                    <InputFormField
                      name="password"
                      placeholder="Placeholder_NewPassword"
                      labelText="Labels_NewPassword"
                      inputType="password"
                      autoCompleteOff
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 align-middle items-center">
                      <div className="h-4 w-4">
                        {passwordValidation.isTenChar ? (
                          <IoMdCheckmark size={16} />
                        ) : (
                          <RxCross2 size={16} />
                        )}
                      </div>
                      <p className="text-xs font-medium">Minimum length 10 characters</p>
                    </div>
                    <div className="flex flex-row gap-2 align-middle items-center">
                      <div className="h-4 w-4">
                        {passwordValidation.isUpperCase ? (
                          <IoMdCheckmark size={16} />
                        ) : (
                          <RxCross2 size={16} />
                        )}
                      </div>
                      <p className="text-xs font-medium">1 uppercase character (A-Z)</p>
                    </div>
                    <div className="flex flex-row gap-2 align-middle items-center">
                      <div className="h-4 w-4">
                        {passwordValidation.isLowerCase ? (
                          <IoMdCheckmark size={16} />
                        ) : (
                          <RxCross2 size={16} />
                        )}
                      </div>
                      <p className="text-xs font-medium">1 lowercase character (a-z)</p>
                    </div>
                    <div className="flex flex-row gap-2 align-middle items-center">
                      <div className="h-4 w-4">
                        {passwordValidation.hasDigitOrSpecialChar ? (
                          <IoMdCheckmark size={16} />
                        ) : (
                          <RxCross2 size={16} />
                        )}
                      </div>
                      <p className="text-xs font-medium">
                        1 digit (0-9) or 1 special character (!@#$%^&*, etc.)
                      </p>
                    </div>
                  </div>
                  <InputFormField
                    name="repeatPassword"
                    placeholder="Placeholder_RepeatPassword"
                    labelText="Labels_RepeatNewPassword"
                    inputType="password"
                    autoCompleteOff
                  />
                  <div className="flex justify-left">
                    <Button
                      disabled={!isAllPassTrue()}
                      variant={ButtonVariant?.BLACK}
                      size={SIZE.MEDIUM}
                      isTypeSubmit={true}
                      isCTATextInCaps="1"
                    >
                      <p className="text-sm">{CTALabel?.value}</p>
                    </Button>
                  </div>
                </form>
              </div>
            </FormProvider>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserAuthentication;

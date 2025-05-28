import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { MdOutlineLock } from 'react-icons/md';
import { SignInProps, FormErrorMessages } from '../../molecules/SignIn/SignIn.types';
import { RichText, Text as TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from '@/core/atoms/Link/Link';
import { useI18n } from 'next-localization';
import { SIZE } from '@/utils/constants';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { createUserSchema } from './SignIn.schema';
import InputFormField from './InputFormField';
import Checkbox from '@/core/atoms/Form/Checkbox/Checkbox';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useAtom, useSetAtom } from 'jotai';
import useCart from '@/hooks/useCart';
import { SignInModel } from '@/api';
import { OpenAPI } from '@/api';
import dynamic from 'next/dynamic';

import {
  DIST_CHNL,
  AUTH_TOKEN,
  CUST_ID,
  CUST_NUM,
  IS_PROUSER,
  PRICE_GP,
  REFRESH_TOKEN,
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
} from '@/config';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { Url } from 'next/dist/shared/lib/router/router';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { cn } from '@/utils/cn';
import { triggerEvent } from '@/utils/eventTracking';
import useLocalStorage from '@/utils/useLocalStorage';
import { checkAnonymousAndRefreshToken, encryptPassword } from '@/utils/authUtils';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';
import LogRocket from 'logrocket';
import { ROUTES } from '@/utils/routes';
const ChangePasswordModal = dynamic(() => import('./ChangePasswordModal'), {
  ssr: false,
  loading: () => <LoaderSpinner />,
});
const SignInForm: React.FC<SignInProps> = (props) => {
  const {
    Title,
    Description,
    Disclaimer,
    EmailMandatory,
    ForgotPasswordLink,
    HomeLink,
    InvalidEmail,
    LoginFailed,
    PasswordMandatory,
    ChangePasswordLink,
    SubTitle,
    Icon,
    Text,
  } = props?.rendering?.fields ?? {};
  const { CTAColor, CTASize, HeadingTag, HeadingSize } = props?.params ?? {};
  const { t } = useI18n();
  const router = useRouter();
  const logAppId = process.env.NEXT_PUBLIC_LOG_ROCKET_APP_ID;

  const { triggerRefetch } = useCart();
  const { setData } = useLocalStorage();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigateUrl, setNavigateUrl] = useState<string | null>(null);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const setAuthorizationAtom = useSetAtom(authorizationAtom);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRemember, setUserRemember] = useState(false);
  const [passwordChangeFlag, setPasswordChangeFlag] = useState<boolean>(false);

  const handleCloseChangePassModal = () => {
    setIsChangePassword(false);
  };
  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      triggerRefetch();
    }
  }, [hasMounted, isAuthenticated, router, triggerRefetch]);

  useEffect(() => {
    if (router?.query?.returnurl && router?.query?.returnurl !== '') {
      setNavigateUrl(router?.query?.returnurl as string);
    } else {
      setNavigateUrl(null);
    }
  }, [router?.query]);

  const errorMessages: FormErrorMessages = {
    Error_email_required: EmailMandatory.value,
    Error_password_required: PasswordMandatory.value,
    LogInFailed: LoginFailed.value,
    Error_email: InvalidEmail.value,
  };

  const formMethods = useForm({
    resolver: yupResolver(createUserSchema(errorMessages)),
    defaultValues: {
      userName: '',
      password: '',
      rememberMe: false,
      roles: [25, 55],
    },
  });

  const mutation = useMutation({
    mutationFn: async (signIn: SignInModel) => {
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }
      return await AuthenticationService.authenticationSignIn(undefined, signIn);
    },
    onSuccess: (data, _variable) => {
      const isRememberMe = formMethods.getValues('rememberMe');
      setPasswordChangeFlag(data?.PasswordChangeFlag);
      if (
        data?.TokenResponse === null &&
        data?.WECOToken === null &&
        data?.ChangePasswordRequired === true
      ) {
        setIsSubmitting(false);
        setUserRemember(isRememberMe as boolean);
        setUserEmail(_variable?.userName as string);
        setUserPassword(_variable?.password as string);
        setIsChangePassword(true);
      } else if (data?.PasswordChangeFlag === true) {
        setIsSubmitting(false);
        setUserRemember(isRememberMe as boolean);
        setUserEmail(_variable?.userName as string);
        setUserPassword(_variable?.password as string);
        setIsChangePassword(true);
      } else {
        setData(USR_EMAIL, _variable?.userName);
        const { RefreshToken, AccessToken } = data?.TokenResponse || {};
        const { accessToken, refreshToken } = data?.WECOToken || {};
        Cookies.set(CAN_CREATE_USER, data?.CanCreateCompanyUsers);

        Cookies.set(USR_PREFERRED_STORE, data?.PreferredStore);
        if (formMethods.getValues('rememberMe') && RefreshToken) {
          Cookies.set(REFRESH_TOKEN, RefreshToken, { expires: 7 });
        }

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
        if (logAppId && logAppId !== undefined && data?.CustomerId && _variable?.userName) {
          LogRocket?.identify(data?.CustomerId as string, {
            email: _variable?.userName as string,
          });
        }
        if (data?.ChangePasswordRequired === true) {
          router.replace(ChangePasswordLink?.value?.href || '/');
        } else if (navigateUrl !== null) {
          router.replace(navigateUrl);
        } else {
          router.replace(HomeLink as Url);
        }
        triggerEvent({
          event: event.LOGIN,
          userId: data?.CustomerNumber,
        });
      }
      if (data) {
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
      }
    },
    onError: () => {
      setSignInError(LoginFailed?.value);
      setIsSubmitting(false);
    },
  });

  const onSubmit = formMethods.handleSubmit((data: SignInModel) => {
    setIsChangePassword(false);
    setIsSubmitting(true);
    mutation.mutate({
      userName: data.userName?.replace(/\s+/g, ''),
      password: encryptPassword(data.password as string),
      roles: data.roles,
    });
  });

  useEffect(() => {
    const emailSearch = router?.query?.email;
    if (emailSearch && emailSearch !== '') {
      formMethods.reset({
        userName: emailSearch as string,
        password: '',
        rememberMe: false,
        roles: [25, 55],
      });
    } else {
      router.replace(ROUTES?.EMAILSEARCH);
    }
  }, [router?.query?.email]);

  if (!hasMounted) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }
  return (
    <>
      {isChangePassword && (
        <ChangePasswordModal
          open={isChangePassword}
          closeModal={handleCloseChangePassModal}
          email={userEmail}
          password={userPassword}
          rememberMe={userRemember}
          ChangePasswordLink={ChangePasswordLink}
          HomeLink={HomeLink}
          SubTitle={SubTitle}
          HeadingTag={HeadingTag}
          Icon={Icon}
          passwordChangeFlag={passwordChangeFlag}
        />
      )}

      <div className="container mx-auto flex justify-center px-5 md:px-10 ">
        {mutation.isPending && <LoaderSpinner />}
        <div className="w-650 pt-8 pb-14 md:pt-14 md:pb-16 flex flex-col gap-y-2">
          <div className="text-center flex flex-col gap-y-2 md:gap-y-6">
            <TextField
              field={Title}
              tag={HeadingTag || 'h2'}
              className={cn(
                `text-dark-gray text-3xl lg:text-5xl lg:font-latoLight ${getHeadingStyles(HeadingSize, HeadingTag)}`
              )}
            />
            <RichText field={Description} className="max-w-lg mx-auto" />
          </div>
          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
              <div className="md:px-24">
                <div>
                  <InputFormField
                    name="userName"
                    labelValue="Labels_EmailAddress"
                    placeholderValue={t('FormLabels_Emailaddress')}
                    autoCompleteOff
                  />
                </div>
                <div className="mb-4">
                  <InputFormField
                    name="password"
                    inputType="password"
                    labelValue="Labels_Password"
                    placeholderValue={t('Labels_Password')}
                    autoCompleteOff
                  />
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Controller
                      name="rememberMe"
                      render={({ field }) => (
                        <Checkbox
                          id="rememberMe"
                          {...field}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      )}
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-base text-gray-900">
                      {t('Labels_RememberMe')}
                    </label>
                  </div>
                  <Link
                    field={ForgotPasswordLink}
                    className="  text-xs underline-offset-4 text-deep-red-tone	"
                  />
                </div>

                <Button
                  variant={CTAColor as ButtonVariant}
                  size={CTASize as SIZE}
                  className={`w-full ${isSubmitting ? 'cursor-not-allowed bg-button-gray border border-dark-gray text-dark-gray hover:bg-button-gray' : ''}`}
                  isTypeSubmit={true}
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                >
                  {t('Labels_SignIn')}
                </Button>
                {signInError && <div className="mb-4 mt-4 text-red-600 text-sm">{signInError}</div>}
                <div className="flex items-center text-left text-green-dark mt-4 text-xs">
                  <MdOutlineLock className="w-4 h-4 mr-2" />
                  {Disclaimer?.value}
                </div>
              </div>
            </form>
          </FormProvider>
          <div className="text-center flex flex-col gap-y-2 md:gap-y-6">
            <RichText field={Text} className=" text-xs font-semibold mt-6" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;

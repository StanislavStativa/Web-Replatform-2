import React, { useEffect, useState } from 'react';
import Modal from 'react-responsive-modal';
import { ITypesChangePasswordModal } from './SignIn.types';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { FormProvider, useForm } from 'react-hook-form';
import { useI18n } from 'next-localization';
import { FormErrorMessages } from '../ResetPassword/ResetPassword.types';
import { yupResolver } from '@hookform/resolvers/yup';

import InputFormField from '../ResetPassword/InputFormField';
import { IoMdCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { SIZE } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { SignInModel } from '@/api/models/SignInModel';
import Cookies from 'js-cookie';
import { useSetAtom } from 'jotai';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';

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
import { OpenAPI } from '@/api';
import { useRouter } from 'next/router';
import { authorizationAtom } from '@/data/atoms/authorization';
import { triggerEvent } from '@/utils/eventTracking';
import { Url } from 'next/dist/shared/lib/router/router';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { resetSignPasswordSchema } from './ResetSignIn.schema';
import Image from '@/core/atoms/Image/Image';
import useLocalStorage from '@/utils/useLocalStorage';
import { encryptPassword } from '@/utils/authUtils';

const ChangePasswordModal = ({
  open,
  closeModal,
  password,
  email,
  rememberMe,
  HomeLink,
  ChangePasswordLink,
  SubTitle,
  HeadingTag,
  Icon,
  passwordChangeFlag,
}: ITypesChangePasswordModal) => {
  const { t } = useI18n();
  const router = useRouter();
  const { setData } = useLocalStorage();

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isTenChar: false,
    isUpperCase: false,
    isLowerCase: false,
    hasDigitOrSpecialChar: false,
  });
  const [navigateUrl, setNavigateUrl] = useState<string | null>(null);
  const setAuthorizationAtom = useSetAtom(authorizationAtom);

  const errorMessages: FormErrorMessages = {
    Error_Required_CurrentPassword: useI18n().t('Error_Required_CurrentPassword'),
    Error_Required_NewPassword: useI18n().t('Error_Required_NewPassword'),
    Error_Passwordlength: useI18n().t('Error_Passwordlength'),
    Error_passwords_do_not_match: useI18n().t('Error_CheckPassword'),
    Error_ExistingPassword: useI18n().t('Error_ExistingPassword'),
    Error_Required_RepeatPassword: useI18n().t('Error_Required_RepeatPassword'),
  };
  const formMethods = useForm({
    resolver: yupResolver(resetSignPasswordSchema(errorMessages)),
    defaultValues: {
      currentPassword: password,
      userName: email,
      newPassword: '',
      repeatNewPassword: '',
      rememberMe: rememberMe,
      roles: [25, 55],
    },
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });
  const watchNewPassword = formMethods.watch('newPassword');

  const mutation = useMutation({
    mutationFn: (signIn: SignInModel) => {
      return AuthenticationService.authenticationSignIn(undefined, signIn);
    },
    onSuccess: (data) => {
      setData(USR_EMAIL, email);
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
      setShowErrorMsg(true);
    },
  });

  const onSubmit = formMethods.handleSubmit((data) => {
    setShowErrorMsg(false);
    mutation.mutate({
      password: data?.currentPassword,
      newPassword: encryptPassword((data?.newPassword as string) || ''),
      roles: data?.roles,
      userName: data?.userName,
      passwordChangeFlag: passwordChangeFlag,
    });
  });

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
    if (router?.query?.returnurl && router?.query?.returnurl !== '') {
      setNavigateUrl(router?.query?.returnurl as string);
    } else {
      setNavigateUrl(null);
    }
  }, [router?.query]);
  const isAllPassTrue = () => {
    return Object.values(passwordValidation).every((value) => value === true);
  };
  return (
    <Modal
      open={open}
      onClose={closeModal}
      showCloseIcon={true}
      center
      classNames={{
        modal: 'bg-white !rounded-xl !p-6 !shadow-none !m-0 mt-5 z-i',
      }}
    >
      {mutation.isPending && <LoaderSpinner className="bg-transparent" />}
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center">
        <div className="col-span-1 md:col-span-11 md:col-start-1 flex flex-col gap-y-4 rounded-xl border border-gray-300 pt-11 pb-13 px-4 md:px-9 bg-white">
          <div className="w-full">
            <div className="flex items-center">
              <div className="hidden md:block w-11 h-11 mr-10">
                <Image field={Icon} />
              </div>
              <Text
                tag={HeadingTag || 'h2'}
                className="text-left text-xl font-semibold"
                field={SubTitle}
              />
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
                className="ml-5 col-span-1 md:col-span-5 md:col-start-2 flex flex-col gap-y-4"
              >
                <InputFormField
                  name="newPassword"
                  placeholder="Placeholder_NewPassword"
                  labelText="Labels_NewPassword"
                  inputType="password"
                  autoCompleteOff
                />
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
                  name="repeatNewPassword"
                  placeholder="Placeholder_RepeatPassword"
                  labelText="Labels_RepeatNewPassword"
                  inputType="password"
                  autoCompleteOff
                />
                <div className="flex justify-left">
                  <Button
                    disabled={!isAllPassTrue()}
                    variant={ButtonVariant?.BLACK}
                    size={SIZE.SMALL}
                    isTypeSubmit={true}
                    isCTATextInCaps="1"
                  >
                    <p className="text-sm">{t('Labels_ResetPassword')}</p>
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;

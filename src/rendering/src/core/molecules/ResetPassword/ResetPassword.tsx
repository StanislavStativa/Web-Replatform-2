import { FormErrorMessages, ResetPasswordProps } from './ResetPassword.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { FormProvider, useForm } from 'react-hook-form';
import InputFormField from './InputFormField';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from './ResetPasswordSchema';
import Image from '@/core/atoms/Image/Image';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { useMutation } from '@tanstack/react-query';
import { ResetPasswordRequest } from '@/api/models/ResetPasswordRequest';
import { safeJsonParse } from '@/utils/safeJsonParse ';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { IoMdCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import router from 'next/router';
import Cookies from 'js-cookie';
import { AUTH_TOKEN } from '@/config';
import { encryptPassword } from '@/utils/authUtils';
const ResetPassword = (props: ResetPasswordProps) => {
  const { t } = useI18n();
  const { CTALabel, Title, Icon, EmarsysDetails } = props?.rendering?.fields;
  const { CTAColor, CTASize, HeadingTag } = props?.params;
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [showPasswordMatched, setShowPasswordMatched] = useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isTenChar: false,
    isUpperCase: false,
    isLowerCase: false,
    hasDigitOrSpecialChar: false,
  });
  const errorMessages: FormErrorMessages = {
    Error_Required_CurrentPassword: useI18n().t('Error_Required_CurrentPassword'),
    Error_Required_NewPassword: useI18n().t('Error_Required_NewPassword'),
    Error_Passwordlength: useI18n().t('Error_Passwordlength'),
    Error_passwords_do_not_match: useI18n().t('Error_CheckPassword'),
    Error_ExistingPassword: useI18n().t('Error_ExistingPassword'),
    Error_Required_RepeatPassword: useI18n().t('Error_Required_RepeatPassword'),
  };
  const { EmailFieldId, SubmitAction } = EmarsysDetails?.fields ?? {};
  const submitActionValue = safeJsonParse(
    SubmitAction?.[0]?.fields?.EmarsysAdditionalProperty?.value
  );

  const { EmarsysEventID } = submitActionValue;
  const formMethods = useForm<{
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  }>({
    resolver: yupResolver(resetPasswordSchema(errorMessages)),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });

  const watchNewPassword = formMethods.watch('newPassword');

  const mutation = useMutation({
    mutationFn: (ResetPassword: ResetPasswordRequest) => {
      return AuthenticationService.authenticationResetPassword(undefined, ResetPassword);
    },
    onSuccess: (data) => {
      if (data?.IsPasswordChange) {
        Cookies.set(AUTH_TOKEN, data?.TokenResponse?.AccessToken);

        formMethods.reset();
        sessionStorage.setItem('isPasswordChanged', 'true');
        router.push(props?.rendering?.fields?.RedirectURL?.value?.href as string);
      } else {
        setShowErrorMsg(true);
      }
    },
    onError: () => {
      setShowErrorMsg(true);
      formMethods.reset();
    },
  });

  const onSubmit = formMethods.handleSubmit((data: ResetPasswordRequest) => {
    if (data?.currentPassword === data?.newPassword) {
      setShowPasswordMatched(true);
    } else {
      setShowPasswordMatched(false);
      setShowErrorMsg(false);
      mutation.mutate({
        currentPassword: encryptPassword((data?.currentPassword as string) || ''),
        newPassword: encryptPassword((data?.newPassword as string) || ''),
        resetPasswordFormModels: {
          submitAction: {
            emarsysEventID: EmarsysEventID,
          },
          fieldMappings: {
            emailFieldId: EmailFieldId?.value,
          },
        },
      });
    }
  });
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showPasswordMatched) {
      timeoutId = setTimeout(() => {
        setShowPasswordMatched(false);
      }, 10000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showPasswordMatched]);

  useEffect(() => {
    const conditions = {
      isTenChar: watchNewPassword?.length >= 10,
      isUpperCase: /[A-Z]/.test(watchNewPassword),
      isLowerCase: /[a-z]/.test(watchNewPassword),
      hasDigitOrSpecialChar: /[0-9!@#$%^&*]/.test(watchNewPassword),
    };

    setPasswordValidation(conditions);
  }, [watchNewPassword]);
  const isAllPassTrue = () => {
    return Object.values(passwordValidation).every((value) => value === true);
  };
  return (
    <div className="py-8 container mx-auto px-4">
      {mutation?.isPending && <LoaderSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center">
        <div className="col-span-1 md:col-span-11 md:col-start-1 flex flex-col gap-y-4 rounded-xl border border-gray-300 mb-8 md:mb-16 pt-11 pb-13 px-4 md:px-9 bg-white">
          <div className="w-full">
            <div className="flex items-center">
              <div className="hidden md:block w-11 h-11 mr-10">
                <Image field={Icon} />
              </div>
              <Text
                tag={HeadingTag || 'h2'}
                className="text-left text-xl font-semibold"
                field={Title}
              />
            </div>
            <div className="pt-2">
              {showErrorMsg && (
                <NotificationMessage
                  message={t('not_current_password')}
                  isCloseable
                  onCancel={() => setShowErrorMsg(false)}
                />
              )}
              {showPasswordMatched && (
                <NotificationMessage
                  message={t('label_unique_password')}
                  isCloseable
                  onCancel={() => setShowPasswordMatched(false)}
                />
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
                  name="currentPassword"
                  placeholder="Placeholder_CurrentPassword"
                  labelText="Labels_CurrentPassword"
                  inputType="password"
                  autoCompleteOff
                />
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
                    variant={CTAColor as ButtonVariant}
                    size={(CTASize as SIZE) || SIZE.SMALL}
                    isTypeSubmit={true}
                    isCTATextInCaps={props?.params?.IsCTATextInCaps}
                  >
                    <p className="text-sm">{CTALabel?.value}</p>
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

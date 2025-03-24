import React, { memo, useState } from 'react';
import { ITypesRegisterEmailSearch } from './RegisterEmailSearch.type';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEmailSearchSchema } from '../../EmailSearch/EmailSearch.schema';
import { useI18n } from 'next-localization';
import { FormErrorMessages } from '../../EmailSearch/EmailSearch.type';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { UserStatusRequest } from '@/api/models/UserStatusRequest';
import { useMutation } from '@tanstack/react-query';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import InputFormField from '../../SignIn/InputFormField';
import { useRouter } from 'next/router';
import { ROUTES } from '@/utils/routes';
import { usePathname, useRouter as useNavigation, useSearchParams } from 'next/navigation';

const RegisterEmailSearch = ({ title, btnLabel, subText }: ITypesRegisterEmailSearch) => {
  const { t } = useI18n();
  const router = useRouter();
  const navigate = useNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showError, setShowError] = useState<boolean>(false);
  const [showSearchNotFound, setShowSearchNotFound] = useState<boolean>(false);

  const errorMessages: FormErrorMessages = {
    Error_email_required: t('Error_email_required'),
    Error_email: t('Error_email'),
  };

  const { mutate: searchEmail, isPending } = useMutation({
    mutationFn: async (requestBody?: UserStatusRequest) => {
      return await AuthenticationService.authenticationGetUserStatus(requestBody);
    },
    onSuccess: (data, _variable) => {
      if (data) {
        if (data?.IsPresentInOC || data?.IsPresentInWECO) {
          // Any of the conditions is true
          router.replace({
            pathname: ROUTES?.SIGNIN,
            query: {
              email: _variable?.email,
            },
          });
        } else if (!data?.IsPresentInOC && !data?.IsPresentInWECO) {
          const params = new URLSearchParams(searchParams.toString());
          if (_variable?.email) {
            params.set('email', _variable?.email);
          } else {
            params.delete('email');
          }
          navigate.replace(`${pathname}?${params.toString()}`, { scroll: false });

          setShowSearchNotFound(true);
        }
      } else {
        setShowError(true);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });
  const formMethods = useForm({
    resolver: yupResolver(createEmailSearchSchema(errorMessages)),
    defaultValues: {
      userName: '',
    },
  });

  const onSubmit = formMethods.handleSubmit((data) => {
    setShowError(false);
    setShowSearchNotFound(false);
    const requestData: UserStatusRequest = {
      email: data?.userName?.replace(/\s+/g, ''),
    };
    searchEmail(requestData);
  });
  return (
    <div className="w-full flex flex-col items-center">
      {isPending && <LoaderSpinner />}
      <div className="flex flex-col gap-y-2">
        {showSearchNotFound && (
          <NotificationMessage
            message={t('Error_User_Not_Found')}
            onCancel={() => setShowSearchNotFound(false)}
            isCloseable={true}
          />
        )}
        {showError && (
          <NotificationMessage onCancel={() => setShowError(false)} isCloseable={true} />
        )}
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <div>
              <Text field={title} className="text-2xl font-bold" />
              <InputFormField
                name="userName"
                labelValue="Labels_EmailAddress"
                placeholderValue={t('FormLabels_Emailaddress')}
                autoCompleteOff
              />
            </div>
            <div className="w-full flex align-middle justify-center mt-5">
              <Button
                variant={ButtonVariant.BLACK}
                size={SIZE.LARGE}
                isTypeSubmit={true}
                disabled={isPending}
              >
                {btnLabel?.value}
              </Button>
            </div>
          </form>
        </FormProvider>
        <RichText field={subText} className=" text-xs font-semibold mt-6" />
      </div>
    </div>
  );
};

export default memo(RegisterEmailSearch);

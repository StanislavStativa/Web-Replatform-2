import React, { useState } from 'react';
import { FormErrorMessages, ITypesEmailSearch } from './EmailSearch.type';
import InputFormField from '../SignIn/InputFormField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { RichText, Text as TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { createEmailSearchSchema } from './EmailSearch.schema';
import { useMutation } from '@tanstack/react-query';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { UserStatusRequest } from '@/api/models/UserStatusRequest';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { useRouter } from 'next/router';
import { ROUTES } from '@/utils/routes';
import { checkAnonymousAndRefreshToken } from '@/utils/authUtils';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';

const EmailSearch = (props: ITypesEmailSearch) => {
  const {
    Title,
    Description,
    CTA,

    Text,
  } = props?.rendering?.fields ?? {};
  const router = useRouter();
  const { CTAColor, CTASize, HeadingTag } = props?.params ?? {};
  const { t } = useI18n();
  const [showError, setShowError] = useState<boolean>(false);

  const errorMessages: FormErrorMessages = {
    Error_email_required: t('Error_email_required'),
    Error_email: t('Error_email'),
  };

  const { mutate: searchEmail, isPending } = useMutation({
    mutationFn: async (requestBody?: UserStatusRequest) => {
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }
      return await AuthenticationService.authenticationGetUserStatus(requestBody);
    },
    onSuccess: (data, _variable) => {
      if (data) {
        if (data?.IsPresentInOC || data?.IsPresentInWECO) {
          // Any of the conditions is true
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { path, ...filteredQuery } = router?.query; // Remove 'path' from the query
          router.replace({
            pathname: CTA?.value?.href,
            query: {
              ...filteredQuery,
              email: _variable?.email,
            },
          });
        } else if (!data?.IsPresentInOC && !data?.IsPresentInWECO) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { path, ...filteredQuery } = router?.query; // Remove 'path' from
          router.replace({
            pathname: ROUTES.REGISTERROUTE,
            query: {
              ...filteredQuery,
              email: _variable?.email,
            },
          });
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
    const requestData: UserStatusRequest = {
      email: data?.userName?.replace(/\s+/g, ''),
    };
    searchEmail(requestData);
  });

  return (
    <section className="container mx-auto flex justify-center px-5 md:px-10 ">
      {isPending && <LoaderSpinner />}
      <div className="w-650 pt-8 pb-14 md:pt-14 md:pb-16 flex flex-col gap-y-2">
        <div className="text-center flex flex-col gap-y-2 md:gap-y-6">
          <TextField
            field={Title}
            tag={HeadingTag || 'h2'}
            className="text-dark-gray text-3xl lg:text-5xl lg:font-latoLight"
          />
          <RichText field={Description} className="max-w-lg mx-auto" />
        </div>
        {showError && <NotificationMessage isCloseable onCancel={() => setShowError(false)} />}
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
              <div className="w-full flex align-middle justify-center mt-5">
                <Button
                  variant={CTAColor as ButtonVariant}
                  size={CTASize as SIZE}
                  isTypeSubmit={true}
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                  disabled={isPending}
                >
                  {CTA?.value?.title}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
        <RichText field={Text} className=" text-xs font-semibold mt-6" />
      </div>
    </section>
  );
};

export default EmailSearch;

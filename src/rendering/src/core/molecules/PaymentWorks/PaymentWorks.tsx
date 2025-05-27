import React, { memo, useState } from 'react';
import { FormErrorMessages, ITypesPaymentWorks } from './PaymentWorks.type';
import { useForm, FormProvider } from 'react-hook-form';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import InputFormField from './InputFormField';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { yupResolver } from '@hookform/resolvers/yup';
import { paymentWorksUserSchema } from './PaymentWorksUser.schema';
import { useMutation } from '@tanstack/react-query';
import { EmarsysService } from '@/api/services/EmarsysService';
import { PaymentWorkFormPayloadModels } from '@/api/models/PaymentWorkFormPayloadModels';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { useRouter } from 'next/router';

const PaymentWorks = (props: ITypesPaymentWorks) => {
  const { t } = useI18n();
  const router = useRouter();
  const { FormTitle, FormDescription, SubmitCTA, EmarsysDetails } = props?.rendering?.fields ?? {};
  const { uid } = props?.rendering;
  const [showError, setShowError] = useState<boolean>(false);

  const errorMessages: FormErrorMessages = {
    Error_first_name_required: t('Error_first_name_required'),
    Error_first_name: t('Error_first_name'),
    Error_last_name_required: t('Error_last_name_required'),
    Error_last_name: t('Error_last_name'),
    Error_email_required: t('Error_email_required'),
    Error_email: t('Error_email'),
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (updateData: PaymentWorkFormPayloadModels) => {
      return await EmarsysService.emarsysPaymentWorksform(updateData);
    },
    onSuccess: () => {
      router.replace(SubmitCTA?.value?.href as string);
    },
    onError: () => {
      setShowError(true);
    },
  });

  const formMethods = useForm({
    resolver: yupResolver(paymentWorksUserSchema(errorMessages)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });
  const onSubmit = formMethods.handleSubmit((data) => {
    setShowError(false);

    const submitActions = EmarsysDetails?.fields?.SubmitAction?.map((action) => {
      const parsedProperties =
        action?.fields?.EmarsysAdditionalProperty?.value &&
        JSON?.parse(action?.fields?.EmarsysAdditionalProperty?.value);

      // Ensure EmarsysEventID is a number
      parsedProperties.EmarsysEventID = Number(parsedProperties.EmarsysEventID);

      // Check if SubmitToEmailAddress is not present and add it if necessary
      if (!parsedProperties?.SubmitToEmailAddress) {
        parsedProperties.SubmitToEmailAddress = data?.email;
      }

      return parsedProperties;
    });

    mutate({
      formPayload: data,
      submitAction: submitActions,
      fieldMappings: {
        firstNameFieldId: EmarsysDetails?.fields?.FirstNameFieldId?.value,
        lastNameFieldId: EmarsysDetails?.fields?.LastNameFieldId?.value,
        emailFieldId: EmarsysDetails?.fields?.EmailFieldId?.value,
      },
      eventData: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
      },
    });
  });

  return (
    <section id={uid} className="container mx-auto flex justify-center px-5 md:px-10">
      {isPending && <LoaderSpinner />}
      <div className="w-650 pt-8 pb-14 md:pt-14 md:pb-16 flex flex-col gap-y-2">
        {showError && <NotificationMessage isCloseable onCancel={() => setShowError(false)} />}
        <div className="text-center flex flex-col gap-y-2 md:gap-y-6">
          <Text
            field={FormTitle}
            tag={'h2'}
            className="text-dark-gray text-3xl lg:text-5xl lg:font-latoLight"
          />
          <RichText field={FormDescription} className="max-w-lg mx-auto" />
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
              <InputFormField
                name="firstName"
                placeholder="FormLabels_Firstname"
                labelText="FormLabels_Firstname"
                inputType="text"
              />
              <InputFormField
                name="lastName"
                placeholder="FormLabels_Lastname"
                labelText="FormLabels_Lastname"
                inputType="text"
              />
            </div>
            <div className="grid grid-cols-1 md:mt-1">
              <InputFormField
                name="email"
                placeholder="FormLabels_Emailaddress"
                labelText="FormLabels_Emailaddress"
                inputType="email"
              />
            </div>
            <div className="grid grid-cols-1">
              <div className="w-full flex justify-center mt-6">
                <Button
                  variant={ButtonVariant?.BLACK}
                  size={SIZE.LARGE}
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                  isTypeSubmit={true}
                >
                  {SubmitCTA?.value?.text}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default memo(PaymentWorks);

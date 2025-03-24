import React, { useEffect, useState } from 'react';
import {
  RegProUserCustIdFormFieldProps,
  RegProUserCustIdRegErrs,
  RegisterProUserWithCustomerIDProps,
} from './RegisterProUserWithCustomerID.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n } from 'next-localization';
import { regProUserWithCustIdSchema } from './RegisterProUserWithCustomerID.schema';
import Input from '@/core/atoms/Form/Input/Input';
import Button from '@/core/atoms/Button/Button';
import { useRouter } from 'next/router';
import { SIZE } from '@/utils/constants';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { Modal } from 'react-responsive-modal';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { AuthenticationService } from '@/api/services/AuthenticationService';
import { WECOCustomerRequest } from '@/api/models/WECOCustomerRequest';
import { formatPhoneNumber, removePhoneFormatting } from '@/utils/phoneUtils';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import useLocalStorage from '@/utils/useLocalStorage';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { ProAccountUserInfo } from '../RegisterProUser/RegisterProUser.schema';
const InputFormField = ({ name, placeholder }: RegProUserCustIdFormFieldProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col ">
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            placeholder={t(placeholder)}
            onChange={(e) => {
              if (name === 'telephone') {
                field.onChange(formatPhoneNumber(e.target.value));
              } else {
                field.onChange(e.target.value);
              }
            }}
            className={`w-full lg:w-[415px] ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};

const RegisterProUserWithCustomerID = (props: RegisterProUserWithCustomerIDProps) => {
  const { Title, ToolTipText, CTALabel, CTA, CustomerIDImage } = props?.rendering?.fields;
  const { HeadingTag, CTAColor, CTASize } = props?.params;
  const [isModalOpen, setModalOpen] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const { t } = useI18n();
  const router = useRouter();
  const { setData, getData } = useLocalStorage();

  const fetchedUserDataFromLocalStorage = getData<ProAccountUserInfo>('userInfo');
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: WECOCustomerRequest) => {
      return await AuthenticationService.authenticationGetWecoUser(data);
    },
    onSuccess: (data) => {
      if (data) {
        setShowError(false);
        const custDetails = {
          companyName: data?.compenyName ?? '',
          firstName: data?.address?.firstName ?? '',
          lastName: data?.address?.lastName ?? '',
          email: data?.address?.email ?? '',
          phone: formatPhoneNumber(data?.address?.phone || '') ?? '',
          addressLine1: data?.address?.street ?? '',
          addressLine2: data?.address?.street2 ?? '',
          city: data?.address?.city ?? '',
          state: data?.address?.regionCode ?? '',
          zipCode: data?.address?.zip ?? '',
          preferredStore: '',
          tradeProfessions: '',
          preferredStoreID: data?.preferredStore ?? '',
          existingCustomerId: data?.customerNumber ?? '',
        };
        setData('userInfo', custDetails);

        if (CTA?.value?.target !== '') {
          window.open(CTA?.value?.href as string, '_blank');
        } else {
          router.push(CTA?.value?.href as string);
        }
      } else {
        setShowError(true);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });

  const errorMessages: RegProUserCustIdRegErrs = {
    Error_Registartion_EmailAddress: t('Error_Registartion_EmailAddress'),
    Error_Registration_CustomerNumber: t('Error_Registration_CustomerNumber'),
    FormLabels_Telephonenumber: t('Error_Registration_PhoneNumber'),
    Error_email: t('Error_email'),
    Error_PhoneNumberValid: t('Error_PhoneNumberValid'),
  };

  const formMethods = useForm({
    resolver: yupResolver(regProUserWithCustIdSchema(errorMessages)),
    defaultValues: {
      email: fetchedUserDataFromLocalStorage?.email ?? '',
      telephone: '',
      customerNumber: '',
    },
  });

  const onSubmit = formMethods.handleSubmit((data: WECOCustomerRequest) => {
    mutate({
      email: data?.email,
      telephone: removePhoneFormatting(data?.telephone || ''),
      customerNumber: data?.customerNumber,
    });
  });

  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
      }, 20000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError]);
  return (
    <>
      {isPending && <LoaderSpinner />}
      <div className="py-8  container mx-auto flex justify-center ">
        <div className="lg:w-650 flex flex-col gap-y-4 p-4 lg:p-0">
          {showError && (
            <NotificationMessage
              message={t('Error_WECO_Registration_CustomerID')}
              isCloseable
              onCancel={() => setShowError(false)}
            />
          )}
          <Text
            tag={HeadingTag || 'h2'}
            field={Title}
            className="text-center text-xl lg:text-3xl	 "
          />
          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-4 items-center">
              <InputFormField name="email" placeholder="FormLabels_Emailaddress" />
              <InputFormField name="telephone" placeholder="FormLabels_Phonenumber" />
              <InputFormField name="customerNumber" placeholder="FormLabels_CustomerNumber" />

              <div className="flex justify-center  ">
                <Button
                  className="group-hover:font-bold text-lg w-full lg:w-415"
                  variant={CTAColor as ButtonVariant}
                  size={CTASize as SIZE}
                  isTypeSubmit={true}
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                >
                  {CTALabel?.value}
                </Button>
              </div>
            </form>
            <Text
              tag={HeadingTag || 'h2'}
              field={ToolTipText}
              className="text-center text-base cursor-pointer text-dark-gray font-bold underline"
              onClick={() => {
                setModalOpen(true);
              }}
            />
            <button className="text-dark-gray font-bold underline" onClick={handleBack}>
              {t('Do_Not_Have_Info')}
            </button>
          </FormProvider>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        showCloseIcon={false}
      >
        <Image
          src={CustomerIDImage?.value?.src}
          alt={CustomerIDImage?.value?.alt}
          width={Number(CustomerIDImage?.value?.width)}
          height={Number(CustomerIDImage?.value?.height)}
        />
      </Modal>
    </>
  );
};

export default RegisterProUserWithCustomerID;

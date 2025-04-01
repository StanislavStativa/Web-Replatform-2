import React, { useEffect, useState, useRef } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { FormErrorMessages, ITypesCreateOrChangeUser } from './CreateOrChangeUser.type';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import InputFormField from './InputFormField';
import { createChangeUserSchema } from './CreateOrChangeUser.schema';
import { useRouter } from 'next/router';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useMutation } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService';
import { CompanyUserData } from '@/api/models/CompanyUserData';

import Image from '@/core/atoms/Image/Image';
import useLocalStorage from '@/utils/useLocalStorage';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { FaRegLightbulb } from 'react-icons/fa';
import { safeJsonParse } from '@/utils/safeJsonParse ';
import { WECOUpdateCustomerData } from '@/api/models/WECOUpdateCustomerData';
import { ROUTES } from '@/utils/routes';

const CreateOrChangeUser = (props: ITypesCreateOrChangeUser) => {
  const { t } = useI18n();
  const router = useRouter();
  const hasRun = useRef<boolean>(false);
  const { CreateUserTitle, Icon, ChangeUserTitle, BackLink, EmarsysDetails } =
    props?.rendering?.fields;
  const {
    AddressFieldId,
    CityFieldId,
    CompanyNameFieldId,
    DaytimePhoneFieldId,
    EmailFieldId,
    FirstNameFieldId,
    LastNameFieldId,
    OptinId,
    SAPCustomerFieldId,
    StateFieldId,
    StoreFieldId,
    ZipCodeFieldId,
    SubmitAction,
  } = EmarsysDetails?.fields ?? {};
  const emarsysFields = {
    submitAction: SubmitAction?.map((action) => {
      const submitActionValue =
        safeJsonParse(action?.fields?.EmarsysAdditionalProperty?.value) ?? {}; // Default to an empty object if parsing fails

      return {
        emarsysEventID: submitActionValue.EmarsysEventID,
        //  submitToEmailAddress: fetchedUserDataFromLocalStorage?.email,
      };
    }).filter((action) => action.emarsysEventID), // Filter out any undefined or null emarsysEventID
  };
  const { uid } = props?.rendering;
  const { HeadingTag } = props?.params;
  const { getData, removeData } = useLocalStorage();
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isEditUser, setIsEditUser] = useState<string | null>(null);

  const editUserDetails = getData<CompanyUserData>('editUser');
  const errorMessages: FormErrorMessages = {
    Error_first_name_required: t('Error_first_name_required'),
    Error_first_name: t('Error_first_name'),
    Error_last_name_required: t('Error_last_name_required'),
    Error_last_name: t('Error_last_name'),
    Error_email_required: t('Error_email_required'),
    Error_email: t('Error_email'),
    Error_phone_number_required: t('Error_phone_number_required'),
    Error_phone_number: t('Error_phone_number'),
  };

  const formMethods = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }>({
    resolver: yupResolver(createChangeUserSchema(errorMessages)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (addData: CompanyUserData) => {
      return await UserService.userCreateNewUser(addData);
    },
    onSuccess: () => {
      setShowSuccess(true);
      formMethods.reset();
    },
    onError: () => {
      setShowError(true);
    },
  });

  const { mutate: update, isPending: isUpdatePending } = useMutation({
    mutationFn: async (updateData: WECOUpdateCustomerData) => {
      return await UserService.userUpdateCustomerData(updateData);
    },
    onSuccess: () => {
      handleBack();
    },
    onError: () => {
      setShowError(true);
    },
  });

  const onSubmit = formMethods.handleSubmit((data) => {
    setShowError(false);
    setShowSuccess(false);
    if (isEditUser === 'true') {
      update({
        firstName: data?.firstName,
        lastName: data?.lastName,
        phoneNumber: data?.phoneNumber,
        email: editUserDetails?.email ?? '',
      });
    } else {
      mutate({
        firstName: data?.firstName,
        lastName: data?.lastName,
        phoneNumber: data?.phoneNumber,
        email: data?.email,
        emarsysFields: {
          submitAction: emarsysFields.submitAction,
          fieldMappings: {
            firstNameFieldId: FirstNameFieldId?.value,
            lastNameFieldId: LastNameFieldId?.value,
            emailFieldId: EmailFieldId?.value,
            daytimePhoneFieldId: DaytimePhoneFieldId?.value,
            zipCodeFieldId: ZipCodeFieldId?.value,
            optinId: OptinId?.value,
            companyNameFieldId: CompanyNameFieldId?.value,
            cityFieldId: CityFieldId?.value,
            addressFieldId: AddressFieldId?.value,
            sapCustomerFieldId: SAPCustomerFieldId?.value,
            storeFieldId: StoreFieldId?.value,
            stateFieldId: StateFieldId?.value,
          },
        },
      });
    }
  });

  const handleBack = () => {
    if (isEditUser === 'true') {
      hasRun.current = false;
      removeData('editUser');
      const queryParams = { ...router.query };

      // Remove the specific query parameter
      delete queryParams?.isEditUser;

      // Update the URL without the query parameter
      router.push(
        {
          query: queryParams,
        },
        undefined,
        { shallow: true }
      );
    } else {
      removeData('editUser');
      router.replace(BackLink?.value?.href as string);
    }
  };

  useEffect(() => {
    if (router?.query?.isEditUser) {
      setIsEditUser(router?.query?.isEditUser as string);
    } else {
      setIsEditUser(null);
    }
  }, [router?.query?.isEditUser]);

  useEffect(() => {
    if (!hasRun.current) {
      if (editUserDetails && isEditUser === 'true') {
        formMethods.reset({
          firstName: editUserDetails.firstName ?? '',
          lastName: editUserDetails.lastName ?? '',
          email: editUserDetails.email ?? '',
          phoneNumber: editUserDetails.phoneNumber ?? '',
        });
        hasRun.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editUserDetails, isEditUser]);

  useEffect(() => {
    if (isEditUser === null) {
      formMethods.reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      });
    }
  }, [isEditUser]);

  if (isEditUser === null && router?.asPath.toLocaleLowerCase().includes(ROUTES.MANAGEMEMMBER)) {
    return null;
  }

  return (
    <section key={uid} className="pb-17 md:mb-10 md:py-14 container mx-auto px-4">
      {(isUpdatePending || isPending) && <LoaderSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-10 gap-y-2">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <div className="w-full">
            <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
              <div className="flex md:items-center items-start">
                <div className="hidden md:block w-11 h-11 mr-8">
                  <Image field={Icon} />
                </div>
                <Text
                  tag={HeadingTag || 'h2'}
                  className="text-left text-xl font-semibold"
                  field={isEditUser === 'true' ? ChangeUserTitle : CreateUserTitle}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
          {showError && (
            <NotificationMessage
              message={t('Error_Message_Registration_Default')}
              isCloseable
              onCancel={() => setShowError(false)}
            />
          )}
          {showSuccess && (
            <div className="flex items-center gap-x-1 bg-light-green mr-4 mb-2 p-3 mt-2">
              <FaRegLightbulb color="green" />
              <p>{t('message_user_created_successfully')}</p>
            </div>
          )}
          <FormProvider {...formMethods}>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <form onSubmit={onSubmit} className="col-span-1 md:col-span-6  flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {isEditUser === 'true' ? (
                    <h3 className="text-xl">{editUserDetails && editUserDetails?.email}</h3>
                  ) : (
                    <InputFormField
                      name="email"
                      placeholder="FormLabels_Emailaddress"
                      labelText="FormLabels_Emailaddress"
                      inputType="email"
                    />
                  )}

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

                  <InputFormField
                    name="phoneNumber"
                    placeholder="FormLabels_Phonenumber"
                    labelText="FormLabels_Phonenumber"
                    inputType="text"
                  />
                </div>

                <div className="flex justify-left gap-4 mt-5">
                  <Button
                    variant={ButtonVariant.OUTLINE}
                    isTypeSubmit={false}
                    onClick={handleBack}
                    disabled={isPending || isUpdatePending}
                  >
                    <p className="text-sm">{t('Common_Back')}</p>
                  </Button>
                  <Button disabled={isPending || isUpdatePending} isTypeSubmit={true}>
                    <p className="text-sm">{t('Common_Save')}</p>
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </div>
    </section>
  );
};

export default CreateOrChangeUser;

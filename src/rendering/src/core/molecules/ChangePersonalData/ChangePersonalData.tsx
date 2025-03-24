import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Select from '@/core/atoms/Form/Select/Select';
import { useState, useEffect } from 'react';
import { SIZE } from '@/utils/constants';
import { useI18n } from 'next-localization';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import InputFormField from './InputFormField';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserPersonalSchema } from './ChangePersonalData.schema';
import { FaRegLightbulb } from 'react-icons/fa';
import Image from '@/core/atoms/Image/Image';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService';
import { OcUserPersonalData } from '@/api/models/OcUserPersonalData';
import { ChangePersonalDataProps, FormErrorMessages } from './ChangePersonalData.types';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { GroupedByState, PreferredStoreOption } from '../RegisterProUser/RegisterProUser.types';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import Cookies from 'js-cookie';
import { CUST_NUM, USR_PREFERRED_STORE, SITE_ID } from 'src/config';

const ChangePersonalData = (props: ChangePersonalDataProps) => {
  const { t } = useI18n();
  const { CTA, Title, Icon, SubTitle, Stores } = props?.rendering?.fields;
  const { CTAColor, CTASize, HeadingTag } = props?.params;
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string>('');
  const [CustNo, setCustNo] = useState<string>('');
  const errorMessages: FormErrorMessages = {
    Error_first_name_required: t('Error_first_name_required'),
    Error_first_name: t('Error_first_name'),
    Error_last_name_required: t('Error_last_name_required'),
    Error_last_name: t('Error_last_name'),
    Error_email_required: t('Error_email_required'),
    Error_email: t('Error_email'),
    Error_phone_number_required: t('Error_phone_number_required'),
    Error_phone_number: t('Error_phone_number'),

    Error_Preferred_store_required: t('Error_Preferred_store_required'),
  };

  const { data: initialUserData, isLoading } = useQuery({
    queryKey: ['getUserPersonalData'],
    queryFn: () => {
      return UserService.userGetPersonalData();
    },
  });

  const formMethods = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    preferredStore: string;
  }>({
    resolver: yupResolver(createUserPersonalSchema(errorMessages)),
    defaultValues: {
      firstName: initialUserData?.FirstName ?? '',
      lastName: initialUserData?.LastName ?? '',
      email: initialUserData?.Email ?? '',
      phoneNumber: initialUserData?.Phone ?? '',
      preferredStore: initialUserData?.xp?.PreferredStore ?? '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  });
  // Extract isDirty from formMethods
  const {
    formState: { isDirty },
  } = formMethods;

  const watchPreferredStore = formMethods.watch('preferredStore');

  const groupedByState: GroupedByState = Stores?.reduce((acc: GroupedByState, item) => {
    const state = item?.fields?.StateCode?.value ?? '';
    const storeName = item.fields.StoreName.value ?? '';
    const storeNumber = item.fields.StoreNumber.value ?? '';

    if (!state || !storeName || !storeNumber) return acc; // Skip items with missing values

    if (!acc[state]) {
      acc[state] = [];
    }

    acc[state].push({
      value: storeName,
      label: `${storeName}, ${state}`,
      misc: storeNumber,
    });

    return acc;
  }, {});

  // Step 2: Transform grouped data into the desired structure and sort by label
  const preferredStoreOptions: PreferredStoreOption[] = Object?.keys(groupedByState)
    ?.map((state) => ({
      label: state,
      options: groupedByState[state],
    }))
    ?.sort((a, b) => a?.label?.localeCompare(b?.label)); // Sort alphabetically by label

  const { mutate, isPending } = useMutation({
    mutationFn: async (updateData: OcUserPersonalData) => {
      return await UserService.userChangePersonalData(updateData);
    },
    onSuccess: (data) => {
      setShowSuccess(true);
      if (data?.SiteId) {
        Cookies.set(SITE_ID, data.SiteId);
      }
      queryClient.invalidateQueries({ queryKey: [`getUserPersonalData`] });
    },
    onError: () => {
      setShowError(true);
    },
  });

  const onSubmit = formMethods.handleSubmit((data: OcUserPersonalData) => {
    mutate({
      firstName: data?.firstName,
      lastName: data?.lastName,
      phoneNumber: data?.phoneNumber,
      preferredStore: data?.preferredStore,
      preferredStoreId: storeId,
    });
  });

  //Once the data is fetched reInitializing form with new value
  useEffect(() => {
    if (initialUserData) {
      const selectedOption = preferredStoreOptions.find((option) =>
        option.options.some((store) => store?.misc === initialUserData?.xp?.PreferredStoreId)
      );
      // Extract the misc and label values from the selected option if found
      const selectedStore = selectedOption?.options.find(
        (store) => store?.misc === initialUserData?.xp?.PreferredStoreId
      );

      Cookies.set(USR_PREFERRED_STORE, initialUserData?.xp?.PreferredStoreId);
      formMethods.reset({
        firstName: initialUserData.FirstName ?? '',
        lastName: initialUserData.LastName ?? '',
        email: initialUserData.Email ?? '',
        phoneNumber: initialUserData.Phone ?? '',
        preferredStore: selectedStore?.value ?? '',
      });
    }
  }, [formMethods, initialUserData]);

  useEffect(() => {
    if (watchPreferredStore && watchPreferredStore !== '' && preferredStoreOptions?.length > 0) {
      // Find the selected store option based on watchPreferredStore
      const selectedOption = preferredStoreOptions.find((option) =>
        option.options.some((store) => store.value === watchPreferredStore)
      );

      // Extract the misc and label values from the selected option if found
      const selectedStore = selectedOption?.options.find(
        (store) => store.value === watchPreferredStore
      );

      const selectedMisc = selectedStore?.misc;

      setStoreId(selectedMisc as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPreferredStore]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showSuccess || showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
        setShowSuccess(false);
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError, showSuccess]);

  useEffect(() => {
    const proCustNo = Cookies.get(CUST_NUM);
    if (proCustNo !== undefined) setCustNo(proCustNo);
  }, [CustNo]);

  return (
    <div className="py-8 container mx-auto px-4">
      {(isLoading || isPending) && <LoaderSpinner />}
      <div className="mb-2 font-latoBold">
        {t('Rewards_CustomerID')}: {CustNo}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 justify-center">
        <div className="col-span-1 md:col-span-11 md:col-start-1 flex flex-col gap-y-6 rounded-xl border border-gray-300 mb-8 md:mb-16 pt-11 pb-13 px-4 md:px-9 bg-white">
          <div className="w-full">
            <div className="flex items-center">
              <div className="hidden md:block w-11 h-11 mr-5">
                <Image field={Icon} />
              </div>
              <Text
                tag={HeadingTag || 'h2'}
                className="text-left text-xl font-semibold"
                field={Title}
              />
            </div>
          </div>
          {showSuccess && (
            <div className="flex items-center gap-x-1 bg-light-green mr-4 mb-2 p-3 mt-2">
              <FaRegLightbulb color="green" />
              <p>{t('SuccessMessages_ChangePersonalData')}</p>
            </div>
          )}

          {showError && <NotificationMessage isCloseable onCancel={() => setShowError(false)} />}
          <FormProvider {...formMethods}>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <form
                onSubmit={onSubmit}
                className="col-span-1 md:col-span-10  md:col-start-2 flex flex-col gap-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      {t('FormLabels_PreferredStore')}
                    </label>
                    <Controller
                      name="preferredStore"
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          {...field}
                          groups={preferredStoreOptions}
                          className={`w-full h-50 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                          placeholder={t('FormLabels_PreferredStore')}
                          showNonSelectableDefaultOption={true}
                          selectDefaultValue={t('Labels_Select_Preferred_Store')}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex">
                    <Text
                      tag={HeadingTag || 'h3'}
                      className="text-left text-base font-bold"
                      field={SubTitle}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputFormField
                    name="email"
                    placeholder="FormLabels_Emailaddress"
                    labelText="FormLabels_Emailaddress"
                    inputType="email"
                    disabled
                  />
                  <InputFormField
                    name="phoneNumber"
                    placeholder="FormLabels_Phonenumber"
                    labelText="FormLabels_Phonenumber"
                    inputType="text"
                  />
                </div>

                <div className=" w-full md:w-auto flex md:justify-left">
                  <Button
                    variant={CTAColor as ButtonVariant}
                    size={CTASize as SIZE}
                    isTypeSubmit={true}
                    disabled={!isDirty || isPending}
                    className="w-full md:w-auto"
                  >
                    <p className="text-sm">{CTA?.value?.title}</p>
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

export default ChangePersonalData;

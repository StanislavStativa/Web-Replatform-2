import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import Select from '@/core/atoms/Form/Select/Select';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import {
  FormErrorMessages,
  FormFieldProps,
  GroupedByState,
  PreferredStoreOption,
  TargetItem,
  type RegisterProUserFieldProps,
} from './RegisterProUser.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
import formGroupLogo from 'src/images/Group.png';
import { createUserSchema } from './RegisterProUser.schema';
import { OCUserRequest } from '@/api/models/OCUserRequest';
import useLocalStorage from '@/utils/useLocalStorage';
import { useRouter } from 'next/router';
import { Control, FieldValues } from 'react-hook-form';
import { formatPhoneNumber, removePhoneFormatting } from '@/utils/phoneUtils';
import { UserService } from '@/api/services/UserService';
import { useMutation } from '@tanstack/react-query';
import { ContactEmailModel } from '@/api/models/ContactEmailModel';

import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { CartService } from '@/api/services/CartService';
import { WECOValidatePartnerAddressRequest } from '@/api/models/WECOValidatePartnerAddressRequest';
import { checkAnonymousAndRefreshToken } from '@/utils/authUtils';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';
import PlacesAutocomplete from '../PlacesAutocomplete/PlacesAutocomplete';
// import Checkbox from '@/core/atoms/Form/Checkbox/Checkbox';
const InputFormField = ({ name, placeholder, control, maxLength }: FormFieldProps) => {
  const { t } = useI18n();

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            maxLength={maxLength}
            placeholder={t(placeholder)}
            onChange={(e) => {
              if (name === 'phone') {
                field.onChange(formatPhoneNumber(e.target.value));
              } else {
                field.onChange(e.target.value);
              }
            }}
            className={`w-full ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};

const RegisterProUserForm: React.FC<RegisterProUserFieldProps> = (props) => {
  const { Title, State, Store, TradeProfession } = props?.data?.datasource;
  const [selectedStateName, setSelectedStateName] = useState('');
  const [isUserAlreadyExistsWithEmail, setIsUserAlreadyExistWithEmail] = useState(false);
  const [isPhoneExist, setPhoneExist] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [storeId, setStoreId] = useState('');
  const [storeRegion, setStoreRegion] = useState('');
  const [isAddressError, setAddressError] = useState(false);

  const router = useRouter();
  const routePath = router.asPath;
  const { t } = useI18n();
  const { setData, removeData } = useLocalStorage();

  const errorMessages: FormErrorMessages = {
    Error_company_name_required: t('Error_company_name_required'),
    Error_first_name_required: t('Error_first_name_required'),
    Error_first_name: t('Error_first_name'),
    Error_last_name_required: t('Error_last_name_required'),
    Error_last_name: t('Error_last_name'),
    Error_email_required: t('Error_email_required'),
    Error_email: t('Error_email'),
    Error_phone_number_required: t('Error_phone_number_required'),
    Error_phone_number: t('Error_phone_number'),
    Error_address_line_1_required: t('Error_address_line_1_required'),
    Error_address_line_2_required: t('Error_address_line_2_required'),
    Error_city_required: t('Error_city_required'),
    Error_city_alphabets: t('Error_city_alphabets'),
    Error_state_required: t('Error_state_required'),
    Error_zip_code_required: t('Error_zip_code_required'),
    Error_zip_code: t('Error_zip_code'),
    Error_Preferred_store_required: t('Error_Preferred_store_required'),
    Error_trade_profession_required: t('Error_trade_profession_required'),
  };

  const formMethods = useForm({
    resolver: yupResolver(createUserSchema(errorMessages)),
    defaultValues: {
      companyName: props?.fetchedUserDataFromLocalStorage?.companyName ?? '',
      firstName: props?.fetchedUserDataFromLocalStorage?.firstName ?? '',
      lastName: props?.fetchedUserDataFromLocalStorage?.lastName ?? '',
      email: props?.fetchedUserDataFromLocalStorage?.email ?? '',
      phone: props?.fetchedUserDataFromLocalStorage?.phone ?? '',
      addressLine1: props?.fetchedUserDataFromLocalStorage?.addressLine1 ?? '',
      addressLine2: props?.fetchedUserDataFromLocalStorage?.addressLine2 ?? '',
      city: props?.fetchedUserDataFromLocalStorage?.city ?? '',
      state: props?.fetchedUserDataFromLocalStorage?.state ?? '',
      zipCode: props?.fetchedUserDataFromLocalStorage?.zipCode ?? '',
      preferredStore: props?.fetchedUserDataFromLocalStorage?.preferredStore ?? '',
      tradeProfessions: props?.fetchedUserDataFromLocalStorage?.tradeProfessions ?? '',
      preferredStoreID: props?.fetchedUserDataFromLocalStorage?.preferredStoreID ?? '',
      isEmailOptIn: true,
      existingCustomerId: props?.fetchedUserDataFromLocalStorage?.existingCustomerId ?? '',
    },
  });

  const watchPreferredStore = formMethods.watch('preferredStore');

  const { mutate: checkAddress, isPending: isAddressCheckPending } = useMutation({
    mutationFn: async (data: WECOValidatePartnerAddressRequest) => {
      return CartService.cartValidatePartnerAddress(data);
    },
    onSuccess: (data, variable) => {
      const getStateName =
        stateOptions && stateOptions?.find((item) => item?.value === variable?.state);
      const getStateProfessionName =
        tradeProfessionOptions &&
        tradeProfessionOptions?.find((item) => item?.value === variable?.tradeProfessions);
      if (data?.statusCode === '400') {
        setAddressError(true);
      } else if (data?.statusCode === '200') {
        setData('userInfo', variable);
        if (getStateName && getStateName !== undefined) {
          setData('selectedStateName', getStateName?.stateFullName);
        } else {
          setData('selectedStateName', selectedStateName);
        }

        setData('storeRegion', storeRegion);
        setData('ttsTradeProfession', getStateProfessionName?.label);
        router.push(`${routePath}?confirm=${true}`);
      } else {
        setShowError(true);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });
  const { mutate: checkPhone, isPending: isPhonePending } = useMutation({
    mutationFn: async (data: OCUserRequest) => {
      return UserService.userIsPhoneAlreadyExist({
        phone: removePhoneFormatting(data?.phone as string),
      });
    },
    onSuccess: (data, variable) => {
      if (data === true) {
        setPhoneExist(true);
      } else {
        checkAddress(variable);
        setPhoneExist(false);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });
  const { mutate: checkEmail, isPending } = useMutation({
    mutationFn: async (data: ContactEmailModel) => {
      return UserService.userIsEmailAlreadyExist({ email: data?.email });
    },
    onSuccess: (data, variable) => {
      removeData('isEmailChecked');
      if (data === true) {
        setIsUserAlreadyExistWithEmail(true);
      } else {
        setIsUserAlreadyExistWithEmail(false);
        checkPhone(variable);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });
  const stateOptions = State?.targetItems?.map((item) => ({
    value: item?.StateCode?.jsonValue?.value ?? '',
    label: item?.StateCode?.jsonValue?.value ?? '',
    stateFullName: item?.StateName?.jsonValue?.value ?? '',
  }));

  const groupedByState: GroupedByState = Store?.targetItems?.reduce(
    (acc: GroupedByState, item: TargetItem) => {
      const state = item?.State?.jsonValue?.value ?? '';
      const storeName = item?.StoreName?.jsonValue?.value ?? '';
      const storeNumber = item?.StoreNumber?.jsonValue?.value ?? '';

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
    },
    {}
  );

  // Step 2: Transform grouped data into the desired structure and sort by label
  const preferredStoreOptions: PreferredStoreOption[] = Object?.keys(groupedByState)
    ?.map((state) => ({
      label: state,
      options: groupedByState[state],
    }))
    ?.sort((a, b) => a?.label?.localeCompare(b?.label)); // Sort alphabetically by label

  const tradeProfessionOptions = TradeProfession?.targetItems?.map((item) => ({
    value: item?.TradeProfessionsValue.jsonValue.value,
    label: item?.name,
  }));

  const onSubmit = formMethods.handleSubmit(async (data: OCUserRequest) => {
    props?.clearErrorMessage();
    const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
    if (tokenRefreshed) {
      await anonymousSignIn();
    }
    checkEmail(data);
  });
  const handleAddressSelect = (address: string, city: string, state: string, zip: string) => {
    if (address) {
      formMethods.setValue('addressLine1', address);
      formMethods.clearErrors('addressLine1');
    }
    if (city) {
      formMethods.setValue('city', city);
      formMethods.clearErrors('city');
    }
    const selectedStateOption = stateOptions?.find(
      (option) => option?.stateFullName?.toLowerCase() === state?.toLowerCase()
    );
    if (selectedStateOption) {
      formMethods.setValue('state', selectedStateOption.value);
      setSelectedStateName(selectedStateOption?.stateFullName);
      formMethods.clearErrors('state');
    }

    if (zip) {
      formMethods.setValue('zipCode', zip);
      formMethods.clearErrors('zipCode');
    }

    // You can perform any action with the selected address details here
  };
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
      const selectedLabel = selectedOption?.label;

      setStoreId(selectedMisc as string);
      setStoreRegion(selectedLabel as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPreferredStore]);
  useEffect(() => {
    if (storeId !== '') {
      formMethods.setValue('preferredStoreID', storeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError || isUserAlreadyExistsWithEmail || isPhoneExist) {
      timeoutId = setTimeout(() => {
        setShowError(false);
        setPhoneExist(false);
        setIsUserAlreadyExistWithEmail(false);
        setAddressError(false);
      }, 30000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError, isPhoneExist, isUserAlreadyExistsWithEmail, isAddressError]);

  return (
    <div className="bg-tonal-gray mx-4 md:mx-0 h-full rounded-lg">
      {showError && (
        <NotificationMessage
          message={t('Error_Message_Registration_Default')}
          isCloseable
          onCancel={() => setShowError(false)}
        />
      )}
      {isAddressError && (
        <NotificationMessage
          message={t('Error_WECO_AddressValidate')}
          isCloseable
          onCancel={() => setAddressError(false)}
        />
      )}
      {isPhoneExist && (
        <NotificationMessage
          message={t('Error_WECO_Phone')}
          isCloseable
          onCancel={() => setPhoneExist(false)}
        />
      )}
      {isUserAlreadyExistsWithEmail && (
        <NotificationMessage
          message={t('Error_WECO_Email')}
          isCloseable
          onCancel={() => setIsUserAlreadyExistWithEmail(false)}
        />
      )}
      {(isPending || isPhonePending || isAddressCheckPending) && <LoaderSpinner />}
      <div className="flex items-center justify-center gap-x-4 py-8 ">
        <Image src={formGroupLogo} alt="form" />

        <Text field={Title} tag={'h4'} className="text-center md:text-3xl" />
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit} className="flex flex-col mx-4 md:mx-12">
          <div className="flex flex-col gap-y-3">
            <InputFormField name="companyName" placeholder="FormLabels_Companyname" />

            <div className="grid grid-cols-2 gap-4">
              <InputFormField name="firstName" placeholder="FormLabels_Firstname" />

              <InputFormField name="lastName" placeholder="FormLabels_Lastname" />
            </div>

            {props?.fetchedUserDataFromLocalStorage?.existingCustomerId &&
            props?.fetchedUserDataFromLocalStorage?.existingCustomerId?.length > 2 ? null : (
              <InputFormField name="email" placeholder="FormLabels_Emailaddress" />
            )}
            {props?.fetchedUserDataFromLocalStorage?.existingCustomerId &&
            props?.fetchedUserDataFromLocalStorage?.existingCustomerId?.length > 2 ? null : (
              <InputFormField
                name="phone"
                placeholder="FormLabels_Phonenumber"
                control={formMethods.control as unknown as Control<FieldValues>}
              />
            )}

            <PlacesAutocomplete
              onAddressSelect={handleAddressSelect}
              name="addressLine1"
              placeholder={t('FormLabels_Addressline1')}
            />

            <InputFormField name="addressLine2" placeholder="FormLabels_Addressline2" />

            <div className="grid grid-cols-formMixedInputsForMobile md:grid-cols-formMixedInputs gap-x-2 gap-y-4">
              <InputFormField name="city" placeholder="FormLabels_City" />
              <div>
                <Controller
                  name="state"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={stateOptions}
                      className={`w-full h-50 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                      placeholder={t('FormLabels_State')}
                      showNonSelectableDefaultOption={true}
                      selectDefaultValue={t('Labels_State')}
                      onChange={(event) => {
                        field.onChange(event);
                        const selectedIndex = event.target.options.selectedIndex;
                        const selectedOption = stateOptions[selectedIndex - 1];
                        setSelectedStateName(selectedOption?.stateFullName);
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-span-2 md:col-auto">
                <InputFormField maxLength={5} name="zipCode" placeholder="FormLabels_Zipcode" />
              </div>
            </div>

            <div>
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

            <div>
              <Controller
                name="tradeProfessions"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    options={tradeProfessionOptions}
                    className={`w-full h-50 ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
                    placeholder={t('Labels_Select_Trade_Profession')}
                    showNonSelectableDefaultOption={true}
                    selectDefaultValue={t('Labels_Select_Trade_Profession')}
                  />
                )}
              />
            </div>
          </div>

          <div className=" my-8 flex justify-center ">
            <Button isTypeSubmit={true} className=" min-h-11 w-full md:w-auto text-lg">
              {t('Labels_Create_Pro_Account')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterProUserForm;

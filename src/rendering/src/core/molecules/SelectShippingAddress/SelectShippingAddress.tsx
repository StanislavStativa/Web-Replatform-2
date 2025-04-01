import React, { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from 'next-localization';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Input from '@/core/atoms/Form/Input/Input';
import Select from '@/core/atoms/Form/Select/Select';
import Checkbox from '@/core/atoms/Form/Checkbox/Checkbox';
import Textarea from '@/core/atoms/Form/Textarea/Textarea';
import { AddressService } from '@/api/services/AddressService';
import { createSelectShippingAddressSchema } from './SelectShippingAddress.schema';
import { useShipStore } from '@/store/useShipStore';
import { useShipTo } from '@/hooks/useShipTo';
import {
  InputFormFieldProps,
  ITypeXp,
  SelectShippingAddressFormErrorMessage,
  SelectShippingAddressProps,
} from './SelectShippingAddress.type';
import { cartShippingAddresData } from '@/data/atoms/cartShippingAddresData';
import { Control, FieldValues } from 'react-hook-form';
import { ADDNEWADDRESS } from '@/utils/constants';
import Cookies from 'js-cookie';
import { IS_PROUSER } from '@/config';
import { authorizationAtom } from '@/data/atoms/authorization';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import PlacesAutocomplete from '../PlacesAutocomplete/PlacesAutocomplete';
const InputFormField = ({
  name,
  placeholder,
  control,
  trigger,
  disabled,
  maxLength,
}: InputFormFieldProps) => {
  const { t } = useI18n();
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            placeholder={t(placeholder)}
            maxLength={maxLength}
            disabled={disabled}
            onChange={(e) => {
              field.onChange(e.target.value);
              trigger(name);
            }}
            className={`w-full ${error && 'border-red-500 bg-light-red placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};

const SelectShippingAddress: React.FC<SelectShippingAddressProps> = (props) => {
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const { Title, StatesList } = props?.rendering?.fields;
  const { isOnlySamples, isOnlyItems, sampleAndItem } = useShipTo();
  const { t } = useI18n();
  const { selectedShipCTa } = useShipStore();
  const proUserCookie = Cookies.get(IS_PROUSER);
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const visibility =
    selectedShipCTa.selectedCta === 'ship'
      ? 'block'
      : isOnlySamples
        ? 'block'
        : sampleAndItem
          ? 'block'
          : isOnlyItems
            ? 'hidden'
            : 'hidden';

  const errorMessages: SelectShippingAddressFormErrorMessage = {
    Error_company_name_required: t('Error_company_name_required'),
    Error_address_line_1_required: t('Error_address_line_1_required'),
    Error_address_line_2_required: t('Error_address_line_2_required'),
    Error_city_required: t('Error_city_required'),
    Error_city_alphabets: t('Error_city_alphabets'),
    Error_state_required: t('Error_state_required'),
    Error_zip_code_required: t('Error_zip_code_required'),
    Error_zip_code: t('Error_zip_code'),
  };

  const [formState, setFormState] = useAtom(cartShippingAddresData);
  const formMethods = useForm({
    resolver: yupResolver(createSelectShippingAddressSchema(errorMessages)),
    defaultValues: formState,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });
  const saveAddressWatch = formMethods.watch('savedAddress');

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
      (option) => option?.misc?.toLowerCase() === state?.toLowerCase()
    );
    if (selectedStateOption) {
      formMethods.setValue('state', selectedStateOption.value);
      formMethods.clearErrors('state');
    }

    if (zip) {
      formMethods.setValue('zipCode', zip);
      formMethods.clearErrors('zipCode');
    }

    // You can perform any action with the selected address details here
  };

  useEffect(() => {
    const subscription = formMethods.watch(
      (value: {
        savedAddress: string;
        companyName: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        zipCode: string;
        rememberMe: boolean;
        shippingInstructions: string;
      }) => {
        const updatedValue = {
          ...value,
          companyName: isProUser ? value.companyName : '',
        };
        setFormState(updatedValue);
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMethods, setFormState, isProUser]);

  const { data, isLoading } = useQuery({
    queryKey: ['getAddress'],
    queryFn: () => AddressService.addressGetAddresses(0, true, false),
  });

  const savedAddresses = useMemo(
    () => [
      {
        value: ADDNEWADDRESS,
        label: t('AddressBook_AddAddressCTA'),
        isDefault: false,
      },
      ...(data?.map(
        (address: {
          Street1: string;
          Street2: string;
          City: string;
          Zip: string;
          ID: string;
          xp: ITypeXp;
          CompanyName: string;
          State: string;
        }) => {
          const { Street1, Street2, City, Zip, xp, CompanyName, State } = address;
          const formattedAddress = [Street1, Street2, City, Zip].filter(Boolean).join(', ');
          return {
            value: address.ID,
            label: formattedAddress,
            isDefault: xp?.IsDefault,
            isShipping: xp?.IsShipping,
            companyName: CompanyName,
            State: State,
            Street1: Street1,
            Street2: Street2,
            City: City,
            Zip: Zip,
          };
        }
      ) || []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const stateOptions = StatesList?.map((item) => ({
    value: item.fields?.StateCode?.value,
    label: item.fields?.StateCode?.value,
    misc: item.fields?.StateName?.value,
  }));
  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      const defaultAddress =
        savedAddresses.find((address: { isDefault: boolean }) => address?.isDefault) ||
        savedAddresses[1];

      formMethods.reset({
        savedAddress: defaultAddress?.value === undefined ? ADDNEWADDRESS : defaultAddress?.value,
        companyName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        rememberMe: false,
        shippingInstructions: '',
      });
    }
  }, [formMethods, savedAddresses]);

  useEffect(() => {
    if (saveAddressWatch && saveAddressWatch === ADDNEWADDRESS) {
      formMethods.reset({
        savedAddress: saveAddressWatch,
        companyName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        rememberMe: false,
        shippingInstructions: '',
      });
    }
  }, [saveAddressWatch, formMethods]);

  useEffect(() => {
    if (saveAddressWatch && saveAddressWatch !== 'addNew') {
      const getSelectedAddress = savedAddresses.find((item) => item.value === saveAddressWatch);
      formMethods.reset({
        savedAddress: saveAddressWatch,
        companyName: getSelectedAddress?.companyName,
        addressLine1: getSelectedAddress?.Street1,
        addressLine2: getSelectedAddress?.Street2,
        city: getSelectedAddress?.City,
        state: getSelectedAddress?.State,
        zipCode: getSelectedAddress?.Zip,
        rememberMe: false,
        shippingInstructions: '',
      });
    }
  }, [saveAddressWatch, formMethods, savedAddresses, isProUser]);

  useEffect(() => {
    if (proUserCookie === 'true') {
      setIsProUser(true);
    } else {
      setIsProUser(false);
    }
  }, [proUserCookie]);

  useEffect(() => {
    if (!isAuthenticated) {
      formMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className={`container mx-auto pt-6 px-5 md:px-0 ${visibility}`}>
      {isLoading && <LoaderSpinner />}
      <div className="rounded-xl border border-border-gray bg-white py-6 px-4 md:px-10">
        <div className="grid grid-cols-10">
          <div className="col-span-full md:col-span-6 flex flex-col gap-y-4">
            <Text field={Title} tag="h4" className="text-2xl" />
            <FormProvider {...formMethods}>
              <div className="flex flex-col gap-y-2">
                <label>{t('FormLabels_SavedAddresses')}</label>
                <Controller
                  name="savedAddress"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      options={savedAddresses}
                      className={`w-full h-50 ${error && 'border-red-500 bg-light-red placeholder-light-slate-red'}`}
                      showNonSelectableDefaultOption={false}
                      defaultValue={savedAddresses?.[1]?.value}
                    />
                  )}
                />
              </div>
              <div className="flex items-center">
                <div className="flex-grow border-t border-dark-gray"></div>
                <p>{t('Cart_OptionalNewAddress')}</p>
                <div className="flex-grow border-t border-dark-gray"></div>
              </div>
              <div className="flex flex-col gap-y-3">
                {isProUser && (
                  <InputFormField
                    name="companyName"
                    placeholder="FormLabels_Companyname"
                    control={formMethods.control as unknown as Control<FieldValues>}
                    trigger={formMethods.trigger}
                    disabled={Boolean(saveAddressWatch !== 'addNew')}
                  />
                )}
                {saveAddressWatch === 'addNew' ? (
                  <PlacesAutocomplete
                    onAddressSelect={handleAddressSelect}
                    name="addressLine1"
                    placeholder={t('FormLabels_Addressline1')}
                  />
                ) : (
                  <InputFormField
                    name="addressLine1"
                    placeholder="FormLabels_Addressline1"
                    trigger={formMethods.trigger}
                    disabled={Boolean(saveAddressWatch !== 'addNew')}
                  />
                )}

                <InputFormField
                  name="addressLine2"
                  placeholder="FormLabels_Addressline2"
                  trigger={formMethods.trigger}
                  disabled={Boolean(saveAddressWatch !== 'addNew')}
                />
                <div className="grid grid-cols-formMixedInputsForMobile md:grid-cols-formMixedInputs gap-x-2 gap-y-4">
                  <InputFormField
                    name="city"
                    placeholder="FormLabels_City"
                    trigger={formMethods.trigger}
                    disabled={Boolean(saveAddressWatch !== 'addNew')}
                  />
                  <div>
                    <Controller
                      name="state"
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          {...field}
                          options={stateOptions}
                          className={`w-full h-50 ${error && 'border-red-500 bg-light-red placeholder-light-slate-red'} ${saveAddressWatch !== 'addNew' && 'bg-tonal-gray'}`}
                          placeholder={t('FormLabels_State')}
                          showNonSelectableDefaultOption={true}
                          selectDefaultValue={t('Labels_State')}
                          disabled={Boolean(saveAddressWatch !== 'addNew')}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2 md:col-auto">
                    <InputFormField
                      name="zipCode"
                      placeholder="FormLabels_Zipcode"
                      trigger={formMethods.trigger}
                      disabled={Boolean(saveAddressWatch !== 'addNew')}
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <Controller
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox
                        disabled={Boolean(saveAddressWatch !== 'addNew')}
                        id="rememberMe"
                        {...field}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-base text-gray-900">
                    {t('Cart_SaveAddressNextTime')}
                  </label>
                </div>
                <div className="flex-grow border-t border-dark-gray"></div>
                <div>{t('Cart_ShippingInstrns')}</div>
                <div>
                  <Controller
                    name="shippingInstructions"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        disabled={Boolean(saveAddressWatch !== 'addNew')}
                        className="w-full min-h-48"
                        placeholder=" Remarks require a manual order processing and could delay delivery"
                      />
                    )}
                  />
                </div>
              </div>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectShippingAddress;

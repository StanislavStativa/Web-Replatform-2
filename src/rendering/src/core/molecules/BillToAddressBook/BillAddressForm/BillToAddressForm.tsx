import { useEffect, memo, useState } from 'react';
import { useI18n } from 'next-localization';
import { ITypesBillAddressForm, FormErrorMessages } from './BillAddressForm.type';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import Button from '@/core/atoms/Button/Button';
import Select from '@/core/atoms/Form/Select/Select';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFormField from './InputFormField';
import { createBillingAddressSchema } from './BillAddress.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddressService } from '@/api/services//AddressService';
import { CustomerAddress } from '@/api/models/CustomerAddress';
import { UpdatedAddress } from '@/api/models/UpdatedAddress';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { FORM_SUBMITTED_ERROR_MESSAGES } from '@/utils/constants';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
const BillToAddressForm = ({
  isEdit,
  handleBack,
  stateData,
  selectedIdToPreview,
  isAddNew,
  isBilling,
  isShipping,
}: ITypesBillAddressForm) => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [showError, setShowError] = useState<null | string>(null);
  const errorMessages: FormErrorMessages = {
    Error_company_name_required: t('Error_company_name_required'),
    Error_phone_number_required: t('Error_phone_number_required'),
    Error_phone_number: t('Error_phone_number'),
    Error_address_line_1_required: t('Error_address_line_1_required'),
    Error_address_line_2_required: t('Error_address_line_2_required'),
    Error_city_required: t('Error_city_required'),
    Error_city_alphabets: t('Error_city_alphabets'),
    Error_state_required: t('Error_state_required'),
    Error_zip_code_required: t('Error_zip_code_required'),
    Error_zip_code: t('Error_zip_code'),
  };

  const { data: userAddressData } = useQuery({
    queryKey: ['getAddressById', selectedIdToPreview],
    queryFn: () => {
      return AddressService.addressGetAddresses2(selectedIdToPreview as string);
    },
    enabled: Boolean(selectedIdToPreview !== null && isAddNew === false),
  });

  const { mutate: addNewAddress, isPending } = useMutation({
    mutationFn: async (addNewData: CustomerAddress) => {
      return await AddressService.addressAddAddress(addNewData);
    },
    onSuccess: async (data) => {
      if (data?.ID === null) {
        setShowError(data?.xp);
      } else if (data?.ID !== null) {
        await queryClient.invalidateQueries({ queryKey: [`getAddressBookData`] });
        handleBack();
      } else {
        setShowError(FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT);
      }
    },
    onError: () => {
      setShowError(FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT);
    },
  });
  const { mutate: updateNewAddress, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (addNewData: UpdatedAddress) => {
      return await AddressService.addressUpdateAddress(addNewData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`getAddressBookData`] });
      handleBack();
    },
    onError: () => {
      setShowError(FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT);
    },
  });
  const stateOptions = stateData?.map((item) => ({
    value: item?.displayName,
    label: item?.name,
  }));

  const formMethods = useForm({
    resolver: yupResolver(createBillingAddressSchema(errorMessages)),
    defaultValues: {
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  });

  const onSubmit = formMethods.handleSubmit((data) => {
    setShowError(null);
    if (isAddNew) {
      addNewAddress({
        company: data.companyName,
        address: data.addressLine1,
        address2: data.addressLine2,
        city: data.city,
        phone: data?.phone,
        state: data.state,
        zipCode: data.zipCode,
        shipping: isShipping,
        billing: isBilling,
      });
    } else {
      updateNewAddress({
        company: data.companyName,
        address: data.addressLine1,
        address2: data.addressLine2,
        city: data.city,
        phone: data?.phone,
        state: data.state,
        zipCode: data.zipCode,
        addressId: selectedIdToPreview,
      });
    }
  });

  //Once the data is fetched reInitializing form with new value
  useEffect(() => {
    if (userAddressData && isAddNew === false) {
      formMethods.reset({
        companyName: userAddressData?.CompanyName,
        addressLine1: userAddressData?.Street1,
        addressLine2: userAddressData?.Street2,
        city: userAddressData?.City,
        state: userAddressData?.State,
        zipCode: userAddressData?.Zip,
        phone: userAddressData?.Phone,
      });
    }
  }, [formMethods, userAddressData, isAddNew]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(null);
      }, 20000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError]);
  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        {isPending && <LoaderSpinner />}
        {showError && (
          <NotificationMessage
            message={showError}
            isCloseable
            onCancel={() => setShowError(null)}
          />
        )}
        <form
          onSubmit={onSubmit}
          className="col-span-1 md:col-span-6 md:col-start-1 flex flex-col gap-y-4"
        >
          <InputFormField
            name="companyName"
            placeholder="FormLabels_Companyname"
            labelText="FormLabels_Companyname"
            inputType="text"
            disabled={!isEdit}
          />
          <InputFormField
            name="addressLine1"
            placeholder="FormLabels_Addressline1"
            labelText="FormLabels_Addressline1"
            inputType="text"
            disabled={!isEdit}
          />
          <InputFormField
            name="addressLine2"
            placeholder="FormLabels_Addressline2"
            labelText="FormLabels_Addressline2"
            inputType="text"
            disabled={!isEdit}
          />

          <div className="grid grid-cols-formMixedInputsForMobile md:grid-cols-formMixedInputs gap-x-2 gap-y-4">
            <InputFormField
              name="city"
              placeholder="FormLabels_City"
              labelText={'FormLabels_City'}
              disabled={!isEdit}
            />

            <div>
              <label className="mb-2 block text-xs font-medium">{t('Labels_State')}</label>
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
                    disabled={!isEdit}
                  />
                )}
              />
            </div>

            <div className="col-span-2 md:col-auto">
              <InputFormField
                name="zipCode"
                placeholder="FormLabels_Zipcode"
                labelText={'FormLabels_Zipcode'}
                inputType="text"
                disabled={!isEdit}
                maxLength={5}
              />
            </div>
          </div>

          <InputFormField
            name="phone"
            placeholder="FormLabels_Phonenumber"
            labelText="FormLabels_Phonenumber"
            inputType="text"
            disabled={!isEdit}
          />

          <div className="flex justify-left gap-4">
            {isEdit === true && (
              <Button
                variant={ButtonVariant.BLACK}
                isTypeSubmit={true}
                disabled={isPending || isPendingUpdate}
              >
                {t('CreateAddress_Save')}
              </Button>
            )}

            <Button variant={ButtonVariant.BLACK} isTypeSubmit={false} onClick={handleBack}>
              {t('CreateAddress_Back')}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default memo(BillToAddressForm);

import React, { useState, useEffect } from 'react';
import {
  type ErrorMessages,
  type ScheduleConsultationFormProps,
} from './ScheduleConsultationForm.type';
import { InformationFormSchema } from './ScheduleConsultation.schema';
import { type ButtonVariant } from '@/core/atoms/Button/Button.type';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '@/core/atoms/Form/Select/Select';
import Button from '@/core/atoms/Button/Button';
import Image from '@/core/atoms/Image/Image';
import { useI18n } from 'next-localization';
import InputFormField from './InputField';
import { SIZE } from '@/utils/constants';
import { cn } from '@/utils/cn';

const InformationForm: React.FC<ScheduleConsultationFormProps> = (props): JSX.Element => {
  const { data, setData, onNext, shopStores, getZipCode } = props;
  const { t } = useI18n();
  const {
    params: { CTAColor, CTASize } = {},
    fields: {
      ImageSmartCropFormat,
      ProjectArea,
      ProjectAreaTitle,
      ProjectTitle,
      CheckboxTitle,
      Project,
    } = {},
  } = props.rendering;

  const [checkBoxValue, setCheckBoxValue] = useState<string>(data?.projectAreas ?? '');

  const LeftImage = getAdobeImageURL({
    imageName: props.rendering?.fields?.Image?.value,
    smartCropFormat: ImageSmartCropFormat?.value,
  });

  const errorMessages: ErrorMessages = {
    Error_Empty: t('Error_Empty'),
    Error_ZipCodeValid: t('Error_ZipCodeValid'),
  };

  const formMethods = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(InformationFormSchema(errorMessages)),
    defaultValues: {
      zipCode: data.zipCode ?? '',
      storeName: data.storeName ?? '',
      projectAreas: data.projectAreas ?? '',
      projectProgress: data.projectProgress ?? '',
      referred: data.referred ?? '',
      storeNumber: data.storeNumber ?? '',
      storeStateCode: data.storeStateCode ?? '',
      storePhoneNumber: data.storePhoneNumber ?? '',
    },
    mode: 'onSubmit',
  });
  const watchZipCode = formMethods?.watch('zipCode');
  useEffect(() => {
    if (shopStores?.length > 0) {
      formMethods.setValue('storeName', shopStores?.[0]?.Name);
      formMethods.setValue('storeNumber', shopStores?.[0]?.StoreNumber);
      formMethods.setValue('storeStateCode', shopStores?.[0]?.StateCode);
      formMethods.setValue('storePhoneNumber', shopStores?.[0]?.Phone1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchZipCode, shopStores]);

  const watchMessage = formMethods.watch('referred');
  formMethods.setValue('projectAreas', checkBoxValue);

  useEffect(() => {
    if (watchZipCode && watchZipCode?.length > 4) {
      getZipCode(watchZipCode);
    } else {
      getZipCode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchZipCode]);
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setCheckBoxValue((prevValue) => (prevValue ? `${prevValue}, ${currentValue}` : currentValue));
    } else {
      setCheckBoxValue((prevValue) =>
        prevValue
          .split(',')
          .filter((item) => item.trim() !== currentValue.trim())
          .join(', ')
      );
    }
  };

  const onReferredChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    formMethods.setValue('referred', e.target.value);
  };

  const onHandleStore = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStore = shopStores.find((item) => item.Name === e.target.value);
    formMethods.setValue('storeNumber', selectedStore?.StoreNumber);
    formMethods.setValue('storeStateCode', selectedStore?.StateCode);
    formMethods.setValue('storePhoneNumber', selectedStore?.Phone1);
  };

  const onSubmit = formMethods.handleSubmit((data) => {
    if (data.zipCode && data.storeName) {
      setData(data);
      onNext?.();
    }
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <div className="flex" id="step-one-form">
          <div className="pr-5 h-auto align-top hidden lg:block w-1/2">
            <Image
              alt={LeftImage?.altText}
              className="rounded-l-xl w-full h-full object-cover"
              desktopSrc={LeftImage?.url}
              tabletSrc={LeftImage?.url}
              mobileSrc={LeftImage?.url}
            />
          </div>
          <div className="py-5 w-full lg:w-1/2 text-dark-gray align-top h-auto inline-block">
            <div className="mb-30 lg:mx-0 md:mx-2.5 lg:mr-5 min-h-px">
              <div className="md:flex flex-col-mr-5">
                <div className="md:w-1/2 md:px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_Zipcode')}*`}
                  </label>
                  <InputFormField
                    inputType="tel"
                    name="zipCode"
                    placeholderValue="5-digit zip code"
                  />
                </div>
                <div className="md:w-1/2 md:px-5 ">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_TileShopStore')}*`}
                  </label>
                  <Controller
                    name="storeName"
                    render={({ field, fieldState: { error } }) => (
                      <Select
                        {...field}
                        options={
                          shopStores?.map((item) => {
                            return {
                              label: `${item?.City}, ${item?.StateCode}`,
                              value: item.Name,
                            };
                          }) || []
                        }
                        errorStyle="list-item mt-1 mb-2.5 ml-5 text-error-red-200 font-normal"
                        className={cn(
                          'w-full border border-input-border-gray mt-2 py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none',
                          error && 'border border-error-red-200 focus:border-error-red-200'
                        )}
                        placeholder={t('FormLabels_PreferredStore')}
                        onChange={(e) => {
                          onHandleStore(e);
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-30 lg:mx-0 lg:mr-5 min-h-px">
              <div className="flex ">
                <div className="w-full md:px-5 mb-2 text-sm leading-6 ">
                  <Text field={ProjectAreaTitle} />
                </div>
              </div>
              <div className="flex">
                <div className="md:columns-3 gap-0 w-full text-sm">
                  {ProjectArea?.map((item) => (
                    <div key={item?.id}>
                      <div className="mb-2 leading-6 whitespace-nowrap text-sm flex items-center gap-0.5 md:px-5">
                        <input
                          name="projectAreas"
                          type="checkbox"
                          value={item?.fields?.Key.value}
                          onChange={handleCheckbox}
                          checked={checkBoxValue.includes(item?.fields?.Key.value as string)}
                        />
                        <Text field={item?.fields?.Key} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-30 lg:mx-0 md:mx-2.5 lg:mr-5 min-h-px">
              <div className="flex -mr-5">
                <div className="w-full lg:w-2/3 md:px-5">
                  <label className="text-sm leading-6 font-normal">
                    <Text field={ProjectTitle} />
                  </label>
                  <Controller
                    name="projectProgress"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { label: '', value: '' }, // Empty option
                          ...(Project?.map((item) => {
                            return {
                              label: item.fields.Key.value,
                              value: item.fields.Key.value,
                            };
                          }) || []),
                        ]}
                        className="w-full border border-input-border-gray mt-2 py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-30 lg:mx-0 md:mx-2.5 lg:mr-5 min-h-px">
              <div className="flex -mr-5">
                <div className="w-full md:px-5">
                  <label className="text-sm leading-6 font-normal">
                    <Text field={CheckboxTitle} />
                  </label>
                  <div className="mt-2">
                    <small>{t('FormLabels_DCARichTextLimit')}</small>
                  </div>
                  <textarea
                    name="referred"
                    rows={2}
                    maxLength={200}
                    onChange={onReferredChange}
                    value={watchMessage}
                    className="w-full border h-13 border-input-border-gray py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mr-5">
              <div className="w-full md:px-5 flex justify-end">
                <Button
                  className="w-fit my-1 text-sm px-6 rounded-md hover:shadow-button font-normal hover:font-bold py-3 hover:filter-none"
                  variant={CTAColor as ButtonVariant}
                  isTypeSubmit={true}
                  size={CTASize as SIZE}
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                >
                  {t('FormLabels_Next')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default InformationForm;

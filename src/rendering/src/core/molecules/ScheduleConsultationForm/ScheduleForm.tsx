import React, { useEffect, useState } from 'react';
import { getDay, parse } from 'date-fns';
import {
  ITypesTimeSlot,
  type ErrorMessages,
  type ScheduleConsultationFormProps,
} from './ScheduleConsultationForm.type';
import { ScheduleFormSchema } from './ScheduleConsultation.schema';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '@/core/atoms/Form/Select/Select';
import Input from '@/core/atoms/Form/Input/Input';
import Button from '@/core/atoms/Button/Button';
import Image from '@/core/atoms/Image/Image';
import { useI18n } from 'next-localization';
import DatePickerField from './DatePicker';
import InputFormField from './InputField';
import { SIZE } from '@/utils/constants';
import { cn } from '@/utils/cn';
import useImageFormat from '@/hooks/useImageFormat';
import { generateTimeSlots } from '@/utils/dateUtils';
const ScheduleForm: React.FC<ScheduleConsultationFormProps> = (props) => {
  const { data, setData, onNext, shopStores } = props;

  const { t } = useI18n();
  const {
    params: { CTAColor, CTASize } = {},
    fields: {
      ImageSmartCropFormat,
      Step2Title,
      Step2CheckboxTitle,
      PreferredTime,
      Step2Image,
      MobileImage,
      TabletImage,
    } = {},
  } = props.rendering;

  const [checked, setChecked] = useState<boolean>(true);
  const [closedDays, setClosedDays] = useState<number[]>([]);
  const [timeSlots, setTimeSlots] = useState<ITypesTimeSlot[] | []>([]);
  const { desktopImage, mobileImage, tabletImage } = useImageFormat({
    BannerImage: Step2Image || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });
  const errorMessages: ErrorMessages = {
    Error_Empty: t('Error_Empty'),
    Error_email_address: t('Error_email_address'),
    Error_PhoneNumberValid: t('Error_PhoneNumberValid'),
  };

  const formMethods = useForm({
    resolver: yupResolver(ScheduleFormSchema(errorMessages)),
    criteriaMode: 'all',
    defaultValues: {
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      date: data.date ?? '',
      time: data.time ?? '',
      email: data.email ?? '',
      phoneNumber: data.phoneNumber ?? '',
      IsEmailSignUpRequested: checked ? 'on' : 'off',
    },
    mode: 'onSubmit',
  });

  const watchPhoneNumber = formMethods.watch('phoneNumber');
  const watchDate = formMethods.watch('date');
  useEffect(() => {
    if (!formMethods.getValues('time') && PreferredTime?.length) {
      formMethods.setValue('time', PreferredTime[0]?.fields?.Key?.value);
    }
  }, [formMethods, PreferredTime]);

  useEffect(() => {
    if (data?.storeNumber && shopStores?.length > 0) {
      const getStoreDetails = shopStores.find((item) => item?.StoreNumber === data?.storeNumber);

      if (getStoreDetails) {
        const daysClosed: number[] = [];
        if (
          getStoreDetails?.SundayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.SundayHours === ''
        )
          daysClosed.push(0);
        if (
          getStoreDetails?.MondayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.MondayHours === ''
        )
          daysClosed.push(1);
        if (
          getStoreDetails?.TuesdayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.TuesdayHours === ''
        )
          daysClosed.push(2);
        if (
          getStoreDetails?.WednesdayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.WednesdayHours === ''
        )
          daysClosed.push(3);
        if (
          getStoreDetails?.ThursdayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.ThursdayHours === ''
        )
          daysClosed.push(4);
        if (
          getStoreDetails?.FridayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.FridayHours === ''
        )
          daysClosed.push(5);
        if (
          getStoreDetails?.SaturdayHours?.toLocaleLowerCase() === 'closed' ||
          getStoreDetails?.SaturdayHours === ''
        )
          daysClosed.push(6);

        setClosedDays(daysClosed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.storeNumber]);

  const handlePhoneNumberInput = (value: string) => {
    const strippedValue: string = value.replace(/[^\d]/g, '');
    const formattedValue: string = strippedValue
      .split('')
      .map((char: string, index: number) => (index === 3 || index === 6 ? `-${char}` : char))
      .join('')
      .slice(0, 12);
    formMethods.setValue('phoneNumber', formattedValue);
  };

  const onSubmit = formMethods.handleSubmit((ScheduleFormData) => {
    setData({ ...data, ...ScheduleFormData });
    onNext?.();
  });

  useEffect(() => {
    if (watchDate && data?.storeNumber && shopStores?.length > 0) {
      const storeDetails = shopStores.find((item) => item?.StoreNumber === data?.storeNumber);
      if (storeDetails) {
        const date = parse(watchDate, 'MM/dd/yyyy', new Date());
        const dayOfWeek = getDay(date);

        // Get store hours for the selected weekday
        let hours: string | undefined;
        switch (dayOfWeek) {
          case 0:
            hours = storeDetails.SundayHours;
            break;
          case 1:
            hours = storeDetails.MondayHours;
            break;
          case 2:
            hours = storeDetails.TuesdayHours;
            break;
          case 3:
            hours = storeDetails.WednesdayHours;
            break;
          case 4:
            hours = storeDetails.ThursdayHours;
            break;
          case 5:
            hours = storeDetails.FridayHours;
            break;
          case 6:
            hours = storeDetails.SaturdayHours;
            break;
        }
        // If the store is closed on this day
        if (!hours || hours?.toLocaleLowerCase() === 'closed' || hours === '') {
          setTimeSlots([]);
          return;
        }

        // Split the hours into start and end times, then generate slots
        const [start, end] = hours?.split(' - ');
        // Check if start and end times are defined
        if (!start || !end) {
          setTimeSlots([]); // Set time slots to an empty array if either start or end is not defined
        } else {
          const slots = generateTimeSlots(start, end);
          setTimeSlots(slots);
        }
      } else {
        setTimeSlots([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDate, data?.storeNumber]);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <div className="flex" id="step-two-form">
          <div className="pr-5 h-auto align-top hidden lg:block w-1/2">
            <Image
              alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
              className="rounded-l-xl w-full h-full object-cover"
              desktopSrc={desktopImage?.url}
              tabletSrc={tabletImage?.url}
              mobileSrc={mobileImage?.url}
            />
          </div>
          <div className="py-5 w-full lg:w-1/2 text-dark-gray align-top h-auto inline-block">
            <div className="mb-30 lg:mx-0 mx-2.5 lg:mr-5 min-h-px">
              <div className="flex -mr-5">
                <div className="w-full px-5">
                  <RichText field={Step2Title} className="text-sm mb-2" />
                  <div className="text-sm mb-2 flex flex-col">
                    {t('FormLabels_SelectedLocation')}
                    <span id="selected-location">{data?.storeName}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-30 lg:mx-0 mx-2.5 lg:mr-5 min-h-px">
              <div className="flex -mr-5">
                <div className="w-1/2 px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_ScheduleDate')}*`}
                  </label>
                  <div className="text-base flex items-center gap-0.5 w-full">
                    <DatePickerField
                      name="date"
                      formMethodsValue={formMethods}
                      closedDays={closedDays}
                    />
                  </div>
                </div>
                <div className="w-1/2 px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_PreferredTime')}*`}
                  </label>
                  <Controller
                    name="time"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={timeSlots}
                        className={cn(
                          'w-full border border-input-border-gray mt-2 py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none',
                          timeSlots?.length === 0 && 'opacity-35'
                        )}
                        disabled={Boolean(timeSlots?.length === 0)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-30 lg:mx-0 mx-2.5 lg:mr-5 min-h-px">
              <div className="flex -mr-5">
                <div className="w-1/2 px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_Firstname')}*`}
                  </label>
                  <InputFormField
                    inputType="text"
                    maxLength={40}
                    name="firstName"
                    placeholderValue="First Name"
                  />
                </div>
                <div className="w-1/2 px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_Lastname')}*`}
                  </label>
                  <InputFormField
                    inputType="text"
                    maxLength={40}
                    name="lastName"
                    placeholderValue="Last Name"
                  />
                </div>
              </div>
              <div className="flex -mr-5">
                <div className="w-1/2 px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_Emailaddress')}*`}
                  </label>
                  <InputFormField
                    inputType="text"
                    maxLength={255}
                    name="email"
                    placeholderValue="Email Address"
                  />
                </div>
                <div className="w-1/2 px-5">
                  <label className="text-sm leading-6 font-normal">
                    {`${t('FormLabels_Phonenumber')}*`}
                  </label>
                  <Controller
                    name="phoneNumber"
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Input
                          {...field}
                          inputType="text"
                          maxLength={12}
                          placeholder="___-___-____"
                          value={watchPhoneNumber}
                          onChange={(e) => handlePhoneNumberInput(e.target.value)}
                          errorStyle="list-item mt-1 mb-2.5 ml-5 text-error-red-200 font-normal"
                          className={cn(
                            'w-full h-33 border border-input-border-gray mt-2 py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none',
                            error && 'border border-error-red-200'
                          )}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex -mr-5">
              <div className="px-5 w-90p text-sm flex items-start gap-0.5">
                <input
                  type="checkbox"
                  onChange={(e) => setChecked(e.target.checked)}
                  checked={checked}
                  name="IsEmailSignUpRequested"
                  className="mt-1"
                />
                <div className="mb-2">
                  <Text field={Step2CheckboxTitle} />
                </div>
              </div>
            </div>
            <div className="mr-5">
              <div className="flex -mr-5">
                <div className="w-full px-5 flex justify-between">
                  <Button
                    onClick={props.onBack}
                    isCTATextInCaps={props?.params?.IsCTATextInCaps}
                    className="hover:bg-white w-fit my-1 text-sm px-6 rounded-md  py-3 text-black bg-white border border-black font-normal hover:font-bold"
                  >
                    {t('FormLabels_Back')}
                  </Button>
                  <Button
                    className="w-fit my-1 text-sm px-6 rounded-md hover:shadow-button font-normal hover:font-bold py-3 hover:filter-none"
                    variant={CTAColor as ButtonVariant}
                    isCTATextInCaps={props?.params?.IsCTATextInCaps}
                    size={CTASize as SIZE}
                    isTypeSubmit={true}
                  >
                    {t('FormLabels_Next')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ScheduleForm;

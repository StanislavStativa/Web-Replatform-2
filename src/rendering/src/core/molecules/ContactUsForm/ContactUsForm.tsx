import React, { ChangeEvent, useState } from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ErrorMessages, type ContactUsFormProps, type FormData } from './ContactUsForm.type';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
// import Select from '@/core/atoms/Select/Select';
import Select from '@/core/atoms/Form/Select/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactUsSchema } from './ContactUs.schema';
import InputField from './InputField';
import { useI18n } from 'next-localization';
import Button from '@/core/atoms/Button/Button';
import Recaptcha from '@/core/atoms/Form/Recaptcha/Recaptcha';
import { EmarsysService } from '@/api/services/EmarsysService';
import { ContactUsFormPayload } from '@/api/models/ContactUsFormPayload';
import ErrorMessage from '@/core/atoms/Form/ErrorMessage/ErrorMessage';
import { FORM_SUBMITTED_ERROR_MESSAGES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/router';

const ContactUsForm = (props: ContactUsFormProps) => {
  const {
    fields: { Title, Description, SubTitle, CTA, TopicOptions, EmarsysDetails },
  } = props.rendering;
  const { t } = useI18n();

  const [formSubmitedErrorMessage, setFormSubmitedErrorMessage] = useState<boolean>(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (contactDetails: ContactUsFormPayload) => {
      return EmarsysService.emarsysContactUsForm(contactDetails);
    },
    onSuccess: () => {
      setFormSubmitedErrorMessage(false);
      const href = props?.rendering?.fields?.CTA?.value?.href;
      if (typeof href === 'string') {
        router.push(href);
      }
    },
    onError: () => {
      setFormSubmitedErrorMessage(true);
    },
  });

  const errorMessages: ErrorMessages = {
    Error_email_required: `*${t('Error_email_required')}`,
    Error_Valid_Email: t('Error_Valid_Email'),
    Error_Daytime_Phone_Number_required: `*${t('Error_Daytime_Phone_Number_required')}`,
    Error_Valid_Daytime_Phone_Number: `*${t('Error_Valid_Daytime_Phone_Number')}`,
    Error_Message_Required: `*${t('Error_Message_Required')}`,
  };

  const formMethods = useForm({
    resolver: yupResolver(contactUsSchema(errorMessages)),
    defaultValues: {
      firstName: '',
      lastName: '',
      zipCode: '',
      email: '',
      telePhone: '',
      topic: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const watchMessage = formMethods.watch('message');

  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    formMethods.setValue('message', e.target.value);
  };

  const onSubmit = formMethods.handleSubmit((data: FormData) => {
    if (mutation?.isPending) {
      return;
    }
    if (!data.recaptcha) {
      formMethods.setError('recaptcha', { message: t('Validation_Robot') });
      return;
    }
    mutation.mutate({
      formPayload: {
        firstName: data.firstName,
        lastName: data.lastName,
        zipCode: data.zipCode,
        email: data.email,
        concerns: data.topic,
        message: data.message,
        telephone: data.telePhone,
      },
      submitActions: EmarsysDetails.fields.SubmitAction.map((val) =>
        JSON.parse(val.fields.EmarsysAdditionalProperty.value)
      ),
      fieldMappings: {
        firstNameFieldId: EmarsysDetails.fields.FirstNameFieldId.value,
        lastNameFieldId: EmarsysDetails.fields.LastNameFieldId.value,
        zipCodeFieldId: EmarsysDetails.fields.ZipCodeFieldId.value,
        emailFieldId: EmarsysDetails.fields.EmailFieldId.value,
        daytimePhoneFieldId: EmarsysDetails.fields.DaytimePhoneFieldId.value,
        topicsFieldId: EmarsysDetails.fields.TopicsFieldId.value,
        messageFieldId: EmarsysDetails.fields.MessageFieldId.value,
      },
    });
  });

  const handleMaxLength = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = event?.target as HTMLInputElement;
    if (inputElement?.value?.length === 40) {
      event.preventDefault();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="w-full max-w-580">
        <div className="w-full py-1.5 px-5">
          <Text field={Title} tag="h2" className="h2 mb-4 md:mb-7 text-dark-gray" />
          <RichText field={Description} className="font-normal mb-4 text-dark-gray text-base" />
        </div>
        <div className="w-full py-1.5 px-5">
          <Text field={SubTitle} tag="h2" className="h2 mb-4 md:mb-7 text-dark-gray" />
        </div>
        <InputField
          name="firstName"
          inputType="text"
          maxLength={40}
          labelValue={t('FormLabels_Firstname')}
          className="focus:border-cyan-blue focus:shadow-cyanBlue"
        />
        <InputField
          name="lastName"
          inputType="text"
          maxLength={40}
          labelValue={t('FormLabels_Lastname')}
          className="focus:border-cyan-blue focus:shadow-cyanBlue"
        />
        <InputField
          name="zipCode"
          inputType="number"
          maxLength={40}
          onKeyPress={handleMaxLength}
          labelValue={t('FormLabels_ZiporPostalcode')}
          className="focus:border-cyan-blue focus:shadow-cyanBlue"
        />
        <InputField
          name="email"
          inputType="email"
          maxLength={255}
          labelValue={`*${t('FormLabels_Email')}`}
          className="focus:border-cyan-blue focus:shadow-cyanBlue"
        />
        <InputField
          name="telePhone"
          inputType="tel"
          maxLength={40}
          labelValue={`*${t('FormLabels_DaytimePhoneNumber')}`}
          className="focus:border-cyan-blue focus:shadow-cyanBlue"
        />
        <div className="w-full py-1.5 px-5">
          <label className="text-xs font-normal mb-1 text-dark-gray">{`*${t('FormLabels_Topics')}`}</label>
          <Controller
            name="topic"
            render={({ field }) => (
              <Select
                {...field}
                options={
                  TopicOptions?.map((item) => {
                    return {
                      label: item.fields.Title.value,
                      value: item.fields.Title.value,
                    };
                  }) || []
                }
                className={`text-black text-base focus:border-cyan-blue focus:shadow-cyanBlue w-full border border-input-border-gray rounded shadow-input py-1 px-2.5 h-33`}
                showNonSelectableDefaultOption={true}
                arrowSize={true}
                placeholder={t('Labels_SelectaTopic')}
                selectDefaultValue={t('Labels_SelectaTopic')}
                onChange={(event) => {
                  field.onChange(event);
                }}
              />
            )}
          />
        </div>
        <div className="w-full py-1.5 px-5">
          <label className="text-xs font-normal mb-1 text-dark-gray">{`*${t('FormLabels_Message')}`}</label>
          <textarea
            name="message"
            rows={4}
            maxLength={2000}
            className="w-full border border-input-border-gray min-h-90 outline-none rounded shadow-input py-1.5 px-2.5 focus:border-cyan-blue focus:shadow-cyanBlue"
            onChange={onMessageChange}
            value={watchMessage}
          />
          {formMethods.formState.errors.message && !watchMessage ? (
            <ErrorMessage name="message" className="text-error-red font-extrabold text-base" />
          ) : null}
        </div>
        <div className="w-full py-1.5 px-5">
          <Recaptcha name="recaptcha" errorClassName="text-error-red font-extrabold text-base" />
        </div>
        <div className="w-full py-1.5 px-5">
          {CTA && (
            <Button
              className={cn(
                'w-fit my-1 text-sm px-6 bg-dark-gray hover:bg-black text-white rounded-md hover:shadow-button font-normal hover:font-bold py-3 hover:filter-none',
                mutation?.isPending || mutation?.isSuccess
                  ? 'hover:bg-button-gray bg-button-gray border cursor-auto border-gray hover:border-gray text-gray hover:text-gray disabled'
                  : ''
              )}
              isTypeSubmit={true}
              isCTATextInCaps={props?.params?.IsCTATextInCaps}
            >
              {CTA?.value?.text}
            </Button>
          )}
        </div>
        {formSubmitedErrorMessage && (
          <p className="text-error-red font-extrabold text-base">
            {FORM_SUBMITTED_ERROR_MESSAGES.DEFAULT}
          </p>
        )}
        <div className="w-full py-1.5 px-5">
          <p className="mb-4 text-base font-normal text-dark-gray">{`*${t('FormLabels_RequiredFields')}`}</p>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContactUsForm;

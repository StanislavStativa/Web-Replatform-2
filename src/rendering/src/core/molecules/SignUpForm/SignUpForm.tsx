import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import InputFormField from './InputFormField';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSignInFormSchema } from './SignUpForm.schema';
import { type FormErrorMessages, type SignUpFormProps } from './SignUpForm.types';
import Label from '@/core/atoms/Form/Label/Label';
import Checkbox from '@/core/atoms/Form/Checkbox/Checkbox';
import { SIZE } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { EmarsysService, SignUpFormPayload } from '@/api';
import { useMutation } from '@tanstack/react-query';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useRouter } from 'next/router';
import { safeJsonParse } from '@/utils/safeJsonParse ';

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  const id = props?.params?.RenderingIdentifier;
  const { CTAColor, CTASize } = props?.params ?? {};
  const { MainTitle, Title, OptionTitle, OptionList, CTA, EmarsysDetails } =
    props?.rendering?.fields ?? {};
  const {
    BrontoEmailSubscriptionListFieldId,
    EmailFieldId,
    EmailOptInFieldId,
    FirstNameFieldId,
    LastNameFieldId,
    SubmitAction,
  } = EmarsysDetails?.fields ?? {};

  const submitActionValue = safeJsonParse(
    SubmitAction?.[0]?.fields?.EmarsysAdditionalProperty?.value
  );

  let EmarsysEventID: number | undefined, SubmitToEmailAddress: string | undefined;
  if (submitActionValue) {
    ({ EmarsysEventID, SubmitToEmailAddress } = submitActionValue);
  }

  const { t } = useI18n();

  const router = useRouter();

  const errorMessages: FormErrorMessages = {
    Error_email_required: t('Error_email_address_required'),
    Error_firstName_required: t('Error_first_name_required'),
    Error_lastName_required: t('Error_last_name_required'),
  };
  const formMethods = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    option?: string;
  }>({
    resolver: yupResolver(createSignInFormSchema(errorMessages)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      option: 'Homeowner',
    },
  });
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    formMethods.watch('option')
  );
  const [checked, setChecked] = useState<boolean>(true);

  useEffect(() => {
    const email = router.query.email as string;
    if (email) {
      formMethods.setValue('email', email);
    }
  }, [router.query.email, formMethods]);

  const { handleSubmit } = formMethods;

  const handleRadioButtonClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const mutation = useMutation({
    mutationFn: (signUpForm: SignUpFormPayload) => {
      return EmarsysService.emarsysSignUpForm(signUpForm);
    },
    onSuccess: () => {
      const href = props?.rendering?.fields?.CTA?.value?.href;
      if (typeof href === 'string') {
        router.push(href);
      }
    },
    onError: (error) => {
      //TODO: add errors as per requirement which is not in US as of now.
      console.error('Error', error);
    },
  });
  const handleOnSubmit = () => {
    mutation.mutate({
      formPayload: {
        firstName: formMethods.getValues('firstName'),
        lastName: formMethods.getValues('lastName'),
        email: formMethods.getValues('email'),
        brontoEmailSubscriptionList: formMethods.getValues('option'),
        optIn: checked,
      },
      submitAction: {
        emarsysEventID: EmarsysEventID,
        submitToEmailAddress: SubmitToEmailAddress,
      },
      fieldMappings: {
        firstNameFieldId: FirstNameFieldId?.value,
        lastNameFieldId: LastNameFieldId?.value,
        emailFieldId: EmailFieldId?.value,
        optinId: EmailOptInFieldId?.value,
        brontoEmailSubscriptionListFieldId: BrontoEmailSubscriptionListFieldId?.value,
      },
    });
  };

  return (
    <section key={id} className="container my-10 md:m-0 mx-auto flex flex-col px-5 ">
      <h1 className="text-28 font-normal mb-8 leading-8 md:text-5xl md:font-light md:leading-58 text-dark-gray md:font-latoLight">
        <Text field={MainTitle} />
      </h1>
      <p className="mb-4 text-base leading-6 text-dark-gray">
        <Text field={Title} />
      </p>
      <p className="mb-4 text-base text-dark-gray">
        *{t('FormLabels_SubscribeMail_RequiredFields')}
      </p>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="md:max-w-580">
          <div className="flex flex-wrap md:flex-nowrap">
            <div className="py-1.5 px-5 w-full md:w-1/2 flex flex-col -mx-0.6">
              <Label className="text-xs font-normal text-dark-gray mb-1">
                *{t('FormLabels_Firstname')}
              </Label>
              <InputFormField
                labelValue="FormLabels_Firstname"
                placeholderValue=""
                maxLength={40}
                showLabel={false}
                {...formMethods.register('firstName', { required: true })}
              />
            </div>
            <div className="py-1.5 px-5 w-full md:w-1/2 flex flex-col -mx-0.6">
              <Label className="text-xs font-normal text-dark-gray mb-1">
                *{t('FormLabels_Lastname')}
              </Label>
              <InputFormField
                labelValue="FormLabels_Lastname"
                placeholderValue=""
                maxLength={40}
                showLabel={false}
                {...formMethods.register('lastName', { required: true })}
              />
            </div>
          </div>
          <div className="py-1.5 px-5 w-full md:w-1/2 flex flex-col -mx-0.6">
            <Label className="text-xs font-normal text-dark-gray mb-1">
              *{t('FormLabels_Emailaddress')}
            </Label>
            <InputFormField
              labelValue="FormLabels_Emailaddress"
              placeholderValue={t('FormPlaceholder_Emailaddress')}
              maxLength={255}
              showLabel={false}
              {...formMethods.register('email', { required: true })}
            />
          </div>
          <div className="text-xs font-normal text-dark-gray py-1.5 px-5 -mx-0.6">
            <p className="mb-1">
              <Text field={OptionTitle} />
            </p>
            {OptionList?.map((option) => (
              <button
                key={option?.fields?.Key?.value}
                className="text-xs font-normal text-dark-gray mb-1 flex items-center gap-3.6"
                onClick={() =>
                  handleRadioButtonClick(
                    option?.fields?.Key?.value ? option?.fields?.Key?.value?.toString() : ''
                  )
                }
              >
                <input
                  type="radio"
                  id={option?.id}
                  value={option?.fields?.Value?.value}
                  onClick={() =>
                    handleRadioButtonClick(
                      option?.fields?.Key?.value ? option?.fields?.Key?.value?.toString() : ''
                    )
                  }
                  checked={selectedOption === option?.fields?.Key?.value}
                  {...formMethods.register('option', { required: true })}
                  className="hover:border-black"
                />
                <label htmlFor={`option-${option?.displayName}`}>{option?.displayName}</label>
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <Label
              htmlFor={t('FormLabels_SubscribeMail_OptInTitle')}
              className="text-xs font-normal text-dark-gray mb-1"
            >
              <Controller
                name={t('FormLabels_SubscribeMail_OptInTitle')}
                render={({ field }) => (
                  <Checkbox
                    id={t('FormLabels_SubscribeMail_OptInTitle')}
                    {...field}
                    defaultTrue={checked}
                    onClick={handleCheckboxChange}
                    className="mr-3.6"
                  />
                )}
              />
              {t('FormLabels_SubscribeMail_OptInTitle')}
            </Label>
          </div>
          <Button
            isTypeSubmit={true}
            size={CTASize as SIZE}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
            variant={CTAColor as ButtonVariant}
            className="my-1.5 mx-5 hover:font-bold !text-sm !bg-tonal-gray !text-dark-gray"
          >
            {CTA?.value?.text}
          </Button>
        </form>
      </FormProvider>
    </section>
  );
};

export default SignUpForm;

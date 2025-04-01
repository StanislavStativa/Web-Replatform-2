import { useForm, FormProvider } from 'react-hook-form';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Button from '@/core/atoms/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { ForgotPasswordFieldProps, FormErrorMessages } from './ForgotPassword.types';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { ForgotPasswordSchema } from './ForgotPasswordSchema';
import { useMutation } from '@tanstack/react-query';
import { AuthenticationService, ForgotPasswordRequest } from '@/api';
import InputFormField from './InputFormField';
import { useI18n } from 'next-localization';
import { FaRegLightbulb } from 'react-icons/fa';
import { safeJsonParse } from '@/utils/safeJsonParse ';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
const ForgotPasswordForm: React.FC<ForgotPasswordFieldProps> = ({ rendering }) => {
  const {
    CTALabel,
    Description,
    InvalidEmail,
    EmailMandatory,
    Title,
    SuccessMessage,
    EmarsysDetails,
  } = rendering.fields;

  const { HeadingTag } = rendering.params;
  const { t } = useI18n();

  const { CTASize, CTAColor } = rendering?.params;
  const [showConfirmationPage, setShowConfirmationPage] = useState(false);
  const { EmailFieldId, SubmitAction } = EmarsysDetails?.fields ?? {};
  const submitActionValue = safeJsonParse(
    SubmitAction?.[0]?.fields?.EmarsysAdditionalProperty?.value
  );
  const { EmarsysEventID } = submitActionValue;
  const errorMessages: FormErrorMessages = {
    Error_email: InvalidEmail.value,
    Error_email_required: EmailMandatory.value,
  };

  const formMethods = useForm<{ email: string }>({
    resolver: yupResolver(ForgotPasswordSchema(errorMessages)),
    defaultValues: {
      email: '',
    },
  });

  const { errors } = formMethods.formState;

  const mutation = useMutation({
    mutationFn: (ForgotPassword: ForgotPasswordRequest) => {
      return AuthenticationService.authenticationForgotPassword(ForgotPassword);
    },
    onSuccess: () => {
      setShowConfirmationPage(true);

      formMethods.reset();
    },
    onError: () => {
      setShowConfirmationPage(true);
    },
  });

  const onSubmit = formMethods.handleSubmit((data: ForgotPasswordRequest) => {
    mutation.mutate({
      email: data?.email,
      forgotPasswordFormModels: {
        formPayload: {
          email: data?.email,
        },
        submitAction: {
          emarsysEventID: EmarsysEventID,
          submitToEmailAddress: data?.email,
        },
        fieldMappings: {
          emailFieldId: EmailFieldId?.value,
        },
      },
    });
  });

  return (
    <div className=" container flex justify-center mx-auto pt-8 pb-12 px-5 md:px-10 md:pb-20 md:pt-17">
      {mutation?.isPending && <LoaderSpinner />}
      <div className="md:w-621 flex flex-col  items-center  ">
        <div className="text-center md:w-538 mb-8 flex flex-col gap-y-3">
          <Text field={Title} tag={HeadingTag || 'h2'} className=" text-dark-gray md:lato-h1" />
          <RichText field={Description} className=" " />
        </div>
        <div className="w-full mb-2">
          {showConfirmationPage && (
            <div className="flex items-center gap-x-1 bg-light-green container w-full mx-1 p-3 ">
              <FaRegLightbulb color="green" />
              <RichText field={SuccessMessage} className="" />
            </div>
          )}
          {errors.email && errors.email.type === 'required' && (
            <NotificationMessage message={t('Error_email_address')} />
          )}
        </div>
        <div className=" container flex flex-col items-center gap-y-2 rounded-xl border border-gray-300  mb-8 px-5   py-9 md:px-10   bg-white w-full">
          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-3 w-full md:w-auto">
              <div className="">
                <InputFormField
                  name="email"
                  placeholderValue={t('FormLabels_Emailaddress')}
                  showRequiredEmailMsgBelow={errors.email && errors.email.type === 'required'}
                />
              </div>

              <div className="flex w-full md:w-auto">
                <Button
                  variant={CTAColor as ButtonVariant}
                  size={CTASize as SIZE}
                  className="w-full lg:w-414"
                  isTypeSubmit={true}
                >
                  <p className="text-lg"> {CTALabel?.value} </p>
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import Label from '@/core/atoms/Form/Label/Label';
import { useI18n } from 'next-localization';
import { EmarsysService } from '@/api/services/EmarsysService';
import { type UnsubscribeFormProps, type FormData, ErrorMessages } from './UnsubscribeForm.types';
import Button from '@/core/atoms/Button/Button';
import { UnsubscribeFormSchema } from './UnsubscribeForm.schema';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { UnSubscribeFormPayload } from '@/api/models/UnSubscribeFormPayload';
import InputFormField from './InputField';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useRouter } from 'next/router';
import { SIZE } from '@/utils/constants';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const UnsubscribeForm = (props: UnsubscribeFormProps): JSX.Element => {
  const { Title, Label: Subheading, CTA, EmarsysDetails } = props?.rendering?.fields ?? {};
  const { EmailFieldId, OptInFieldId, SubmitAction } = EmarsysDetails?.fields ?? {};

  const submitActionValue = JSON.parse(SubmitAction[0]?.fields?.EmarsysAdditionalProperty?.value);
  const { EmarsysEventID } = submitActionValue;
  const { CTAColor, CTASize } = props?.rendering?.params ?? {};
  const { t } = useI18n();
  const [formSubmitedErrorMessage, setFormSubmitedErrorMessage] = useState<boolean>(false);

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (unSubscribeForm: UnSubscribeFormPayload) => {
      return EmarsysService.emarsysUnSubscribeForm(unSubscribeForm);
    },
    onSuccess: () => {
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
    Error_email_required: `${t('Error_email_required')}`,
    Error_Valid_Email: t('Error_Valid_Email'),
  };

  const formMethods = useForm({
    resolver: yupResolver(UnsubscribeFormSchema(errorMessages)),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = formMethods.handleSubmit((data: FormData) => {
    if (mutation?.isPending) {
      return;
    }
    mutation.mutate({
      formPayload: {
        email: data?.email,
        optIn: false,
      },
      submitAction: {
        emarsysEventID: EmarsysEventID,
      },
      fieldMappings: {
        emailFieldId: EmailFieldId?.value,
        optinId: OptInFieldId?.value,
      },
    });
  });

  return (
    <div className="container mx-auto flex flex-col px-2 pb-4 p md:px-3">
      {mutation?.isPending && <LoaderSpinner />}
      <div>
        <h1 className="text-28 font-normal mb-8 leading-8 md:text-5xl md:font-light md:leading-58 text-dark-gray font-latoLight">
          <Text field={Title} />
        </h1>
        {formSubmitedErrorMessage && (
          <p className="text-error-red text-base px-5  mb-4">{t('Error_Emarsys_Submit')}</p>
        )}
        <p className="px-5 py-1.5 mb-4 text-base leading-6 text-dark-gray">
          <Text field={Subheading} />
        </p>
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <div className="py-1.5 px-5 mb-42 w-full md:w-4/5">
              <Label className="text-xs font-normal text-dark-gray">{t('FormLabels_Email')}</Label>
              <InputFormField
                labelValue="FormLabels_Email"
                placeholderValue={t('FormLabels_Email')}
                maxLength={255}
                {...formMethods.register('email', {
                  required: true,
                  minLength: 1,
                  onBlur: () => {
                    formMethods.trigger('email');
                  },
                })}
              />
            </div>

            {CTA && (
              <div className="py-1.5 px-5">
                <Button
                  isTypeSubmit={true}
                  size={CTASize as SIZE}
                  variant={CTAColor as ButtonVariant}
                  className={` hover:font-bold `}
                >
                  {CTA?.value?.text}
                </Button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default UnsubscribeForm;

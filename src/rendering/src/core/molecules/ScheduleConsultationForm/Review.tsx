import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ScheduleConsultationFormProps } from './ScheduleConsultationForm.type';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useI18n } from 'next-localization';
import Button from '@/core/atoms/Button/Button';
import { SIZE } from '@/utils/constants';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { EmarsysService } from '@/api/services/EmarsysService';
import { ScheduleConsultationFormPayload } from '@/api/models/ScheduleConsultationFormPayload';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const Review: React.FC<ScheduleConsultationFormProps> = (props) => {
  const { data, onSuccessScreen } = props;
  const { t } = useI18n();
  const {
    params: { CTAColor, CTASize, HeadingTag = 'h1' } = {},
    fields: { Step3Title, ProjectTitle, CheckboxTitle, EmarsysDetails } = {},
  } = props.rendering;

  const replacements: { [key: string]: string } = {
    '{{firstname}}': data.firstName ?? '',
    '{{lastname}}': data.lastName ?? '',
    '{{email}': data.email ?? '',
    '{{phonenumber}}': data.phoneNumber ?? '',
    '{{storename}}': data.storeName ?? '',
    '{{storenumber}}': data.storeNumber ?? '',
    '{{date}}': data.date ?? '',
    '{{time}}': data.time ?? '',
    '{{projectareas}}': data.projectAreas ?? '',
    '{{projectprogress}}': data.projectProgress ?? '',
    '{{referred}}': data.referred ?? '',
  };

  function replaceMultiple(str: string, replacements: { [s: string]: string } | ArrayLike<string>) {
    if (replacements) {
      for (const [oldStr, newStr] of Object.entries(replacements)) {
        str = str.split(oldStr).join(newStr);
      }
    }
    return str;
  }

  const htmlBodyData = props.rendering.fields.HTMLBody.value;
  const storeMessageData = props.rendering.fields.StoreManagerHtmlMessage.value;
  const storeEmail = props.rendering.fields.StoreEmail.value;

  const htmlBody = replaceMultiple(htmlBodyData, replacements);
  const storeMessage = replaceMultiple(storeMessageData, replacements);

  const mutation = useMutation({
    mutationFn: (ScheduleConsultationDetails: ScheduleConsultationFormPayload) => {
      return EmarsysService.emarsysScheduleConsultationForm(ScheduleConsultationDetails);
    },
    onSuccess: () => {
      if (onSuccessScreen) {
        // Check if onSuccessScreen is defined
        onSuccessScreen();
      }
    },
  });

  const formMethods = useForm({
    defaultValues: {
      zipCode: '',
      storeName: '',
      projectAreas: '',
      projectProgress: '',
      referred: '',
      date: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      time: '',
    },
  });

  const onSubmit = formMethods.handleSubmit(() => {
    if (mutation?.isPending) {
      return;
    }

    const submitActionObject = JSON.parse(
      EmarsysDetails?.fields?.SubmitAction?.[0]?.fields?.EmarsysAdditionalProperty?.value || '{}'
    );

    mutation.mutate({
      formPayload: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        zipCode: data?.zipCode,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        streetAddress: '',
        city: '',
        state: '',
        date: data?.date,
        time: data?.time,
        storeNumber: data?.storeNumber,
        storeName: data?.storeName,
        projectAreas: data?.projectAreas,
        estimatedBudget: '',
        projectProgress: data?.projectProgress,
        designStyle: '',
        inspiration: '',
        referred: data?.referred,
        optInFieldValue: data?.IsEmailSignUpRequested,
        emailTemplate: '',
        storeEmail: storeEmail,
        storeStateCode: data.storeStateCode,
        storePhoneNumber: data.storePhoneNumber,
        htmlBody: htmlBody,
        storeManagerHtmlMessage: storeMessage,
      },
      submitAction: submitActionObject,
      fieldMappings: {
        firstNameFieldId: EmarsysDetails?.fields.FirstNameFieldId.value,
        lastNameFieldId: EmarsysDetails?.fields.LastNameFieldId.value,
        zipCodeFieldId: EmarsysDetails?.fields.ZipCodeFieldId.value,
        emailFieldId: EmarsysDetails?.fields.EmailFieldId.value,
        phoneNumberFieldId: EmarsysDetails?.fields.PhoneNumberFieldId.value,
        streetAddressFieldId: EmarsysDetails?.fields.StreetAddressFieldId.value,
        cityFieldId: EmarsysDetails?.fields.CityFieldId.value,
        stateFieldId: EmarsysDetails?.fields.StateFieldId.value,
        dateFieldId: EmarsysDetails?.fields.DateFieldId.value,
        timeFieldId: EmarsysDetails?.fields.TimeFieldId.value,
        storeNumberFieldId: EmarsysDetails?.fields.StoreNumberFieldId.value,
        projectAreasFieldId: EmarsysDetails?.fields.ProjectAreasFieldId.value,
        estimatedBudgetFieldId: EmarsysDetails?.fields.EstimatedBudgetFieldId.value,
        projectProgressFieldId: EmarsysDetails?.fields.ProjectProgressFieldId.value,
        designStyleFieldId: EmarsysDetails?.fields.DesignStyleFieldId.value,
        inspirationFieldId: EmarsysDetails?.fields.InspirationFieldId.value,
        referredFieldId: EmarsysDetails?.fields.ReferredFieldId.value,
        optInFieldValue: EmarsysDetails?.fields.OptInFieldValue.value,
      },
    });
  });

  return (
    <div className="flex" id="step-three-form">
      {mutation?.isPending && <LoaderSpinner />}
      <div className="w-full md:px-5 text-slate-gray-500">
        <Text
          tag={HeadingTag}
          field={Step3Title}
          className="hidden lg:block mb-5 mt-12  leading-10 text-32 font-medium text-center"
        />
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 md:px-5">
                <h2 className="leading-8 text-2xl font-normal">
                  {t('FormLabels_ContactInformation')}
                </h2>
                <hr className="my-2" />
                <p className="mb-4 text-base text-dark-gray">
                  {`${data?.firstName} ${data?.lastName}`}
                  <br />
                  {`${data?.email}`}
                  <br />
                  <span className="hover:underline hover:text-black font-bold cursor-pointer">
                    {`${data?.phoneNumber}`}
                  </span>
                </p>
              </div>
              <div className="hidden md:block w-1/3 md:px-5" />
              <div className="md:w-1/3 md:px-5">
                <h2 className="leading-8 text-2xl font-normal">
                  {t('FormLabels_AppointmentInformation')}
                </h2>
                <hr className="my-2" />
                <p className="mb-4 text-base text-dark-gray font-bold">
                  {`${t('FormLabels_Date')}: ${data?.date}`}
                  <br />
                  {`${t('FormLabels_Time')}: ${data?.time}`}
                  <br />
                  <span className="font-normal">{`${data?.storeName}`}</span>
                </p>
              </div>
            </div>
            <div className="text-dark-gray">
              <div className="w-full md:px-5">
                <h2 className="leading-8 text-2xl font-normal text-slate-gray-500">
                  {t('FormLabels_ProjectInformation')}
                </h2>
                <hr className="my-2" />
              </div>
              <div className="w-1/2 md:mx-5">
                <label className="mb-1 text-xs font-bold">{t('FormLabels_ProjectArea')}</label>
                <p className="mb-4">{`${data?.projectAreas || 'Not Provided'}`}</p>
              </div>
              <div className="w-full md:mx-5">
                <label className="mb-1 text-xs font-bold">
                  <Text field={ProjectTitle} />
                </label>
                <p className="mb-4">{`${data?.projectProgress || 'Not Provided'}`}</p>
              </div>
              <div className="w-full mr-5 md:mx-5">
                <label className="mb-1 text-xs font-bold">
                  <Text field={CheckboxTitle} />
                </label>
                <p className="mb-4">{`${data?.referred || 'Not Provided'}`}</p>
              </div>
            </div>
            <div className="mr-5">
              <div className="flex -mr-5">
                <div className="w-full md:px-5 flex justify-between">
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
                    size={CTASize as SIZE}
                    isCTATextInCaps={props?.params?.IsCTATextInCaps}
                    isTypeSubmit={true}
                  >
                    {`${t('FormLabels_Submit')}?`}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Review;

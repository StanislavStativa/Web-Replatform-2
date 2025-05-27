import React, { useEffect, useState } from 'react';
import { DataProps, type ScheduleConsultationFormProps } from './ScheduleConsultationForm.type';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { StoresService } from '@/api/services/StoresService';
import InformationForm from './InformationForm';
import Image from '@/core/atoms/Image/Image';
import { useI18n } from 'next-localization';
import { type Stores } from './ScheduleConsultationForm.type';
import ScheduleForm from './ScheduleForm';
import StepItem from './StepItem';
import Review from './Review';
import Confirmation from './Confirmation';
import useImageFormat from '@/hooks/useImageFormat';
import { useQuery } from '@tanstack/react-query';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const ScheduleConsultationForm: React.FC<ScheduleConsultationFormProps> = (props): JSX.Element => {
  const {
    fields: {
      Icon,
      SectionTitle,
      Description,
      HeadingTag = 'h1',
      ImageSmartCropFormat,
      MobileImage,
      TabletImage,
    } = {},
  } = props.rendering;
  const { t } = useI18n();
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<DataProps>({});
  const [shopStores, setShopStores] = useState<Stores>([]);
  const [userZipCode, setUserZipCOde] = useState<null | string>(null);

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: Icon || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });
  const getZipCode = (zip: string | null) => {
    setUserZipCOde(zip);
  };
  const onNext = () => {
    setStep(step + 1);
  };

  const onBack = () => {
    setStep(step - 1);
  };
  const { data: fetchedStores, isLoading } = useQuery({
    queryKey: ['nearestStores', userZipCode],
    queryFn: () => {
      return StoresService.storesNearest(userZipCode as string);
    },
    enabled: Boolean(userZipCode && userZipCode?.length > 4),
    refetchOnWindowFocus: false,
  });

  const handleSuccess = () => {
    setShowThankYou(true);
  };

  useEffect(() => {
    if (fetchedStores) {
      setShopStores(fetchedStores?.Stores);
    }
  }, [fetchedStores]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <InformationForm
            {...props}
            onNext={onNext}
            data={data}
            setData={setData}
            shopStores={shopStores}
            getZipCode={getZipCode}
          />
        );
      case 2:
        return (
          <ScheduleForm
            {...props}
            onNext={onNext}
            onBack={onBack}
            data={data}
            setData={setData}
            shopStores={shopStores}
          />
        );
      case 3:
        return <Review {...props} onBack={onBack} data={data} onSuccessScreen={handleSuccess} />;
      default:
        return;
    }
  };

  return (
    <>
      {isLoading && <LoaderSpinner />}
      {!showThankYou ? (
        <div className="container mx-auto md:px-10 px-5">
          <div className="mx-5 lg:mx-20 mb-10">
            <div className="flex flex-col justify-center items-center text-dark-gray">
              <p className="mb-4">
                <Image
                  alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
                  desktopSrc={desktopImage?.url}
                  tabletSrc={tabletImage?.url}
                  mobileSrc={mobileImage?.url}
                  className="w-[92px] h-[92px]"
                />
              </p>
              {SectionTitle && (
                <Text
                  tag={HeadingTag as string}
                  className="leading-6 lg:leading-38 text-xl mb-22 lg:text-32 lg:font-normal font-semibold text-center"
                  field={SectionTitle}
                />
              )}
            </div>
            <div className="block">
              <div className="flex items-center justify-center md:items-start whitespace-nowrap text-dark-gray">
                <StepItem
                  stepNumber={1}
                  currentStep={step}
                  label={t('FormLabels_DCAStep1')}
                  className="step-right-rule"
                />
                <div className="hidden lg:block relative top-9 whitespace-nowrap border-t border-t-black border-opacity-12 text-black basis-auto flex-grow flex-shrink h-0 leading-6 m-0 min-w-0" />
                <StepItem
                  stepNumber={2}
                  currentStep={step}
                  label={t('FormLabels_DCAStep2')}
                  className="step-right-rule step-left-rule"
                />
                <div className="relative top-9 whitespace-nowrap border-t border-t-black border-opacity-12 text-black hidden lg:block basis-auto flex-grow flex-shrink h-0 leading-6 m-0 min-w-0" />
                <StepItem
                  stepNumber={3}
                  currentStep={step}
                  label={t('FormLabels_DCAStep3')}
                  className="step-left-rule"
                />
              </div>
            </div>
            {renderStep()}
            <div className="mt-12 text-center">
              <RichText field={Description} className="mb-4 text-base font-normal" />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto md:px-10 px-5">
          <div className="mb-10 mt-10 md:mt-32">
            <Confirmation />
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleConsultationForm;

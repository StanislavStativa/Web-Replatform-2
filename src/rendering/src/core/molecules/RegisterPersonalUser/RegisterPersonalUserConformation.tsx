import React, { useState } from 'react';
import Button from '@/core/atoms/Button/Button';
import { createdPersonalUserData } from './RegisterPersonalUser.types';
import { useI18n } from 'next-localization';
import Recaptcha from '@/core/atoms/Form/Recaptcha/Recaptcha';
import { FormProvider, useForm } from 'react-hook-form';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import useLocalStorage from '@/utils/useLocalStorage';

const UserInformation = ({
  keyName,
  keyValue,
  keyValue2,
}: {
  keyName: string;
  keyValue?: string;
  keyValue2?: string;
}) => {
  return (
    <p>
      <span className="font-normal">{keyName}</span> :{' '}
      <span className="font-bold">{`${keyValue}${keyValue2 ? `, ${keyValue2}` : ''}`}</span>
    </p>
  );
};

const RegisterPersonalUserConformation = (props: createdPersonalUserData) => {
  const { getData } = useLocalStorage();
  const storeRegion = getData<string>('storeRegion');
  const [isRecaptcha, setIsRecaptcha] = useState<boolean>(true);
  const {
    personalUserData,
    personalUserStateNameData,
    ConfirmRegistration,
    ConfirmTitle,
    PriorSubmissionMessage,
    handleConfirmSubmit,
    handleNavigateBack,
    HeadingTag,
    formSubmitedErrorMessage,
  } = props;

  const { t } = useI18n();

  const formMethods = useForm();
  const getRecaptchaValue = (recaptha: string) => {
    if (recaptha) {
      setIsRecaptcha(false);
    } else {
      setIsRecaptcha(true);
    }
  };

  return (
    <div className="flex md:justify-center sm:mx-4 md:mx-0 text-dark-gray  px-5 md:px:0">
      <div className=" lg:w-846 md:w-621  w-full ">
        <div className="flex flex-col gap-y-5 ">
          <div className="flex flex-col text-center items-center gap-y-4">
            <Text field={ConfirmTitle} tag={HeadingTag || 'h2'} className="text-3xl md:text-5xl" />
            <Text field={PriorSubmissionMessage} tag={HeadingTag || 'h2'} className="text-base" />
          </div>
          <FormProvider {...formMethods}>
            <div className="rounded-xl border border-border-gray py-9 md:px-10  px-4 gap-y-8  flex flex-col  	">
              <div className="grid grid-cols-1 md:grid-cols-2 px-10 md:px-0">
                <div className="flex flex-col gap-y-1.5 ">
                  <UserInformation
                    keyName={`${t('FormLabels_Emailaddress')}`}
                    keyValue={personalUserData?.email}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_Firstname')}`}
                    keyValue={personalUserData?.firstName}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_Lastname')}`}
                    keyValue={personalUserData?.lastName}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_Phonenumber')}`}
                    keyValue={personalUserData?.phone}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_Address')}`}
                    keyValue={personalUserData?.addressLine1}
                  />
                </div>
                <div className="flex flex-col gap-y-1.5  ">
                  <UserInformation
                    keyName={`${t('FormLabels_City')}`}
                    keyValue={personalUserData?.city}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_Postalcode')}`}
                    keyValue={personalUserData?.zipCode}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_StateRegion')}`}
                    keyValue={personalUserStateNameData}
                  />
                  <UserInformation
                    keyName={`${t('Labels_Preferred_Store')}`}
                    keyValue={personalUserData?.preferredStore}
                    keyValue2={storeRegion || ''}
                  />
                  <UserInformation
                    keyName={`${t('FormLabels_EmailOptIn')}`}
                    keyValue={personalUserData?.isEmailOptIn ? 'Yes' : 'No'}
                  />

                  {/* Todo:- Add dynamic No text */}
                </div>
              </div>
              <div className="flex flex-col items-center gap-y-4  ">
                <p className="px-8 md:px-0">{ConfirmRegistration?.value}</p>
                {formSubmitedErrorMessage && (
                  <p className="text-light-slate-red md:max-w-452 px-8 md:px-0">
                    {t('Error_Message_Registration_Default')}
                  </p>
                )}
                <div>
                  <Recaptcha name="recaptcha" getValue={getRecaptchaValue} />
                </div>
                <div className="contents md:flex justify-center gap-x-8">
                  <Button
                    onClick={handleNavigateBack}
                    variant={ButtonVariant.OUTLINE}
                    className="text-lg w-full"
                  >
                    {t('Common_Back')}
                  </Button>
                  <Button
                    onClick={handleConfirmSubmit}
                    className={`text-lg w-full ${isRecaptcha ? 'opacity-55 hover:opacity-55 hover:bg-dark-gray' : ''}`}
                    disabled={isRecaptcha}
                  >
                    {t('FormLabels_Confirm')}
                  </Button>
                </div>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default RegisterPersonalUserConformation;

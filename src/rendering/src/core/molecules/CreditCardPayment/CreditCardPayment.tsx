import React, { useEffect, useState } from 'react';
import { CreditCardFormErrorMessage, InputFormFieldProps } from './CreditCardPayment.types';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { creditCardPaymentSchema } from './CreditCardPayment.schema';
import Input from '@/core/atoms/Form/Input/Input';
import { useI18n } from 'next-localization';
import { useAtom } from 'jotai';
import {
  creditCardError,
  creditCardInformation,
  isCreditValidationPassed,
} from '@/data/atoms/creditCardEnteredData';
import { authorizationAtom } from '@/data/atoms/authorization';
import CardPointeTokenizer from './CardPointeTokenizer';
import { EmvData, Orientation } from './CardPointeTokenizer.types';
import { useRouter } from 'next/router';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';

const InputFormField = ({ name, placeholder, maxLength }: InputFormFieldProps) => {
  const { t } = useI18n();
  return (
    <div>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            maxLength={maxLength}
            placeholder={t(placeholder)}
            className={`w-full ${error && 'border-red-500 bg-light-red  placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};
const CreditCardPayment = () => {
  const router = useRouter();
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [creditCardData, setCreditCardData] = useAtom(creditCardInformation);
  const [, seIsCreditCardError] = useAtom(creditCardError);
  const [, setCreditValidation] = useAtom(isCreditValidationPassed);
  const { t } = useI18n();
  const [emvState, setEmvState] = useState<{ emvData: EmvData }>();
  const [isCardValidError, setCardValidError] = useState(false);

  const errorMessages: CreditCardFormErrorMessage = {
    Error_cardHolder_name: t('Error_Card_Holder_Name'),
    Error_cardNumber: t('Error_Card_Number_Required'),
    Error_CardValid: t('Error_Card_Number_Valid'),
    Error_Month: t('Error_Card_Holder_Name'),
    Error_Year: t('Error_Card_Holder_Name'),
    Error_CvdCode: t('Error_Card_CVD'),
    Error_zipCode: t('Error_Card_Zipcode'),
  };

  const formMethods = useForm({
    resolver: yupResolver(creditCardPaymentSchema(errorMessages)),
    defaultValues: creditCardData,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });

  const getCardValidError = (error?: string | undefined | null) => {
    if (error && error !== '') {
      setCardValidError(true);
    } else {
      setCardValidError(false);
    }
  };

  // const watchYear = formMethods.watch('year');
  // const watchMonth = formMethods.watch('month');
  // const currentYear = new Date().getFullYear();
  // const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based

  const userEmvData = (emvData: EmvData) => {
    setEmvState({
      emvData: emvData,
    });
    const expiryDate = emvData?.expiryDate || '';

    const date = expiryDate?.slice(0, 4); // First 4 characters for year
    const month = expiryDate?.slice(4); // Last 2 characters for month

    setCreditCardData((prev) => ({
      ...prev,
      tokenid: emvData?.token ?? '',
      month: month ?? '',
      year: date ?? '',
    }));
  };

  const tokenProps = {
    userEmvData: userEmvData,
    maskfirsttwo: true,
    useexpiry: true,
    usemonthnames: true,
    usecvv: true,
    cardnumbernumericonly: false,
    orientation:
      useDeviceType() === DeviceType.Mobile ? Orientation.vertical : Orientation.horizontal,
    invalidinputevent: true,
    enhancedresponse: true,
    formatinput: true,
    tokenizewheninactive: true,
    inactivityto: 500,
    height: 'h-80',
  };

  useEffect(() => {
    const subscription = formMethods.watch((value) => {
      seIsCreditCardError({
        isError: false,
        errorMessage: '',
      });
      const expiryDate = emvState?.emvData?.expiryDate || '';

      const date = expiryDate?.slice(0, 4); // First 4 characters for year
      const month = expiryDate?.slice(4); // Last 2 characters for month

      // If the month is a single digit, add a leading '0'
      // if (month.length === 1) {
      //   month = '0' + month;
      // }
      const creditDetails = {
        cardHolderName: value?.cardHolderName ?? '',
        cardNumber: '',
        month: month ?? '',
        year: date ?? '',
        CvdCode: '',
        zipCode: value?.zipCode ?? '',
        tokenid: emvState?.emvData?.token || '',
      };

      setCreditCardData(creditDetails);
    });
    return () => subscription.unsubscribe();
  }, [formMethods, setCreditCardData, emvState]);

  useEffect(() => {
    const isError = formMethods.formState.isValid;
    setCreditValidation(!isError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMethods.formState.isValid]);

  // useEffect(() => {
  //   // Clear previous error

  //   if (Number(watchYear) === currentYear && Number(watchMonth) <= currentMonth) {
  //     formMethods.setError('year', {
  //       type: 'manual',
  //       message: 'Invalid month for the selected year.',
  //     });
  //   } else {
  //     formMethods.clearErrors('year');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watchMonth, watchYear, currentYear, currentMonth]);

  useEffect(() => {
    if (!isAuthenticated) {
      formMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  useEffect(() => {
    const handleRouteChange = () => {
      // Reset hover state when the route changes
      formMethods.reset();
    };

    // Listen for route change events
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);

    return () => {
      // Cleanup event listeners
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router.events]);

  return (
    <div>
      <div className="flex flex-col gap-y-5">
        <div className="text-2xl">
          <h4>{t('label_card_info')}</h4>
        </div>
        <div>
          <FormProvider {...formMethods}>
            <div className="flex flex-col gap-y-0">
              <div className="max-w-112">
                <InputFormField name="cardHolderName" placeholder="Payment_CardHolderName" />
              </div>

              <CardPointeTokenizer
                site={process.env.NEXT_PUBLIC_CARD_POINT_SITE as string}
                port={process.env.NEXT_PUBLIC_CARD_POINT_PORT as string}
                tokenProps={tokenProps}
                getCartError={getCardValidError}
              />
              <div className={`max-w-32 ${isCardValidError ? 'mt-1' : '-mt-4'} md:mt-5`}>
                <InputFormField maxLength={5} name="zipCode" placeholder="Payment_ZipCode" />
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPayment;

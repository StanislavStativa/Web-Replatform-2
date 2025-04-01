import React, { memo, useRef, useState } from 'react';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useI18n } from 'next-localization';
import { FormProvider, useForm } from 'react-hook-form';
import InputFormField from './InputFormField';
import { ITypesConfirmPayment, ITypesPayInvoice } from './PayInvoice.type';
import { TbCheckbox } from 'react-icons/tb';
import Image from '@/core/atoms/Image/Image';
import { yupResolver } from '@hookform/resolvers/yup';

import { CreditCardFormErrorMessage } from '../CreditCardPayment/CreditCardPayment.types';
import { creditCardPaymentSchema } from '../CreditCardPayment/CreditCardPayment.schema';
import { useReactToPrint } from 'react-to-print';
import { SIZE } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import { InvoicePaymentRequest } from '@/api/models/InvoicePaymentRequest';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import CardPointeTokenizer from '../CreditCardPayment/CardPointeTokenizer';
import { EmvData, Orientation } from '../CreditCardPayment/CardPointeTokenizer.types';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import { getCardBrand } from '@/utils/card';
import { useEffect } from 'react';

const PayInvoice = ({
  goBack,
  selectedInvoices,
  icon,
  amountAssigned = 0,
  notes = '',
  isPayAccount = false,
}: ITypesPayInvoice) => {
  const { t } = useI18n();
  const contentToPrint = useRef<HTMLDivElement>(null);
  const [isPaymentConfirmation, setIsPaymentConfirmation] = useState<boolean>(false);

  const [paymentInfo, setPaymentInfo] = useState<ITypesConfirmPayment[] | []>([]);
  const [emvState, setEmvState] = useState<{ emvData: EmvData }>();
  const [isError, setError] = useState<boolean>(false);
  const [isApiError, setApiError] = useState<boolean>(false);

  const errorMessages: CreditCardFormErrorMessage = {
    Error_cardHolder_name: t('Error_Card_Holder_Name'),
    Error_cardNumber: t('Error_Card_Number_Required'),
    Error_CardValid: t('Error_Card_Number_Valid'),
    Error_Month: t('Error_Card_Holder_Name'),
    Error_Year: t('Error_Card_Holder_Name'),
    Error_CvdCode: t('Error_Card_CVD'),
    Error_zipCode: t('Error_Card_Zipcode'),
  };
  const userEmvData = (emvData: EmvData) => {
    setEmvState({
      emvData: emvData,
    });
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
  const { mutate, isPending } = useMutation({
    mutationFn: async (paymentData: InvoicePaymentRequest) => {
      return await MyAccountService.myAccountPayOpenInvoiceBySnapPay(paymentData);
    },
    onSuccess: (data) => {
      if (data) {
        setError(false);
        setPaymentInfo(data?.payed);
        setIsPaymentConfirmation(true);
      } else {
        setError(true);
      }
    },
    onError: () => {
      setApiError(true);
    },
  });

  const formMethods = useForm({
    resolver: yupResolver(creditCardPaymentSchema(errorMessages)),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      month: '',
      year: '',
      CvdCode: '',
      zipCode: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });

  const onPrint = useReactToPrint({
    removeAfterPrint: true,
  });
  const handlePrint = () => {
    onPrint(null, () => contentToPrint.current);
  };
  const handleCloseConfirm = () => {
    setIsPaymentConfirmation(false);
    goBack();
  };

  const onSubmit = formMethods.handleSubmit((data) => {
    setError(false);
    setApiError(false);
    const expiryDate = emvState?.emvData?.expiryDate || '';

    const date = expiryDate?.slice(0, 4); // First 4 characters for year
    const month = expiryDate?.slice(4); // Last 2 characters for month

    // If the month is a single digit, add a leading '0'
    // if (month.length === 1) {
    //   month = '0' + month;
    // }
    if (isPayAccount === true) {
      mutate({
        customerName: data?.cardHolderName,
        cardNumber: '',
        cardType: getCardBrand(emvState?.emvData?.token || ''),
        month: month ?? '',
        year: date ?? '',
        transactionAmount: parseFloat(Number(amountAssigned)?.toFixed(2)),
        cvvCode: '',
        cardZipCode: data?.zipCode,
        tokenid: emvState?.emvData?.token || '',
        documents: [
          {
            fiDocumentNumber: '',
            fiDocumentLineItem: '',
            fiscalYear: '',
            valueOpen: 0,
            valueToProcess: 0,
            currency: '',
            reasonCode: '',
            referenceNumber: '',
            comment: '',
          },
        ],
        depositDetail: {
          valueToProcess: parseFloat(Number(amountAssigned)?.toFixed(2)),
          currency: 'USD',
          reasonCode: '',
          referenceNumber: String(Math.floor(1000000000 + Math.random() * 9000000000)),
          comment: notes ?? '',
        },
      });
    } else {
      const modifiedDocs = selectedInvoices?.map((item) => {
        return {
          fiDocumentNumber: item?.fiDocumentNumber as string,
          fiDocumentLineItem: String(item?.fiDocumentLineItem ?? 1) as string,
          fiscalYear: item?.fiscalYear as string,

          valueOpen: Number(parseFloat(item?.openValue)?.toFixed(2)),
          valueToProcess: Number(parseFloat(item?.openValue)?.toFixed(2)),
          currency: 'USD' as string,
          reasonCode: '',
          referenceNumber: '',
          comment: '',
        };
      });
      // Check for invalid fiscalYear values

      mutate({
        customerName: data?.cardHolderName,
        cardNumber: '',
        cardType: getCardBrand(emvState?.emvData?.token || ''),
        month: month ?? '',
        year: date ?? '',
        transactionAmount: parseFloat(amountAssigned?.toFixed(2)),
        cvvCode: '',
        cardZipCode: data?.zipCode,
        documents: modifiedDocs,
        tokenid: emvState?.emvData?.token || '',
        depositDetail: {
          valueToProcess: 0,
          currency: '',
          reasonCode: '',
          referenceNumber: '',
          comment: '',
        },
      });
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isPaymentConfirmation]);

  return (
    <>
      {isPending && <LoaderSpinner />}
      {(isError || isApiError) && (
        <NotificationMessage
          isCloseable
          onCancel={() => {
            setApiError(false);
            setError(false);
          }}
        />
      )}

      <div
        ref={contentToPrint}
        className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white gap-x-10 gap-y-7"
      >
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <div className="w-full">
            <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
              <div className="flex md:items-center items-start">
                <div className="hidden md:block w-11 h-11 mr-8">
                  <Image field={icon} />
                </div>
                <h2 className="text-left text-xl font-semibold">
                  {isPaymentConfirmation
                    ? t('Invoice_PaymentMessage')
                    : t('Invoice_AddProcessPayment')}
                </h2>
              </div>
            </div>
          </div>
        </div>
        {!isPaymentConfirmation && (
          <>
            <div className="col-span-2 md:col-start-2 md:col-span-8  flex gap-10 flex-col">
              <div className="flex flex-col gap-4">
                <div className="w-full hidden md:block">
                  {/* Header */}
                  {selectedInvoices?.length > 0 && (
                    <div className="flex ">
                      <div className="w-20 font-bold text-xs">{t('Invoice_Pay')}</div>
                      <div className="w-40 font-bold text-xs">Invoice Number</div>
                      <div className="w-32 font-bold text-xs">{t('Invoice_Open')}</div>
                    </div>
                  )}

                  {/* Body */}
                  {selectedInvoices?.length > 0 && (
                    <div className="mb-11">
                      {selectedInvoices?.map((row) => (
                        <div key={row.id} className="flex">
                          <div className="w-20 pt-9">
                            <TbCheckbox color="#C5C4C2" />
                          </div>
                          <div className="w-40 pt-9 text-xs font-medium">{row.invoice}</div>
                          {row?.open && (
                            <div
                              className={`w-32 pt-9 text-xs font-medium ${parseFloat(row?.openValue) < 0 ? 'text-green-600' : 'text-light-slate-red'}`}
                            >
                              {`${parseFloat(row?.openValue) < 0 ? '-' : ''}$${Math.abs(parseFloat(row?.openValue)).toFixed(2)}`}
                            </div>
                          )}
                          {row?.orderTotal && (
                            <div className="w-32 pt-9 text-xs font-medium text-light-slate-red ">
                              {`$${row?.orderTotal?.replace('$', '')}`}
                            </div>
                          )}
                          {/* <div className="w-32 pt-9 text-xs font-medium text-light-slate-red ">
                            {`$${row?.netValue || row?.orderTotal?.replace('$', '')}`}
                          </div> */}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="  border-b border-border-gray " />
                  <div className="flex flex-row align-middle pt-2 pl-20 gap-8">
                    <p className="font-bold text-xs">{t('Invoice_AmountAssigned')}</p>{' '}
                    {amountAssigned && (
                      <p className="font-bold text-xs">{`$${Number(amountAssigned)?.toFixed(2)}`}</p>
                    )}
                  </div>
                </div>
                <div className="w-full md:hidden">
                  {selectedInvoices?.map((item) => {
                    return (
                      <div className="mb-8" key={item?.id}>
                        <div className="border-b border-border-gray flex flex-row gap-2 items-center pb-3">
                          <TbCheckbox color="#C5C4C2" />
                          <p className="font-bold text-base">{t('Invoice_Pay')}</p>
                        </div>
                        <div className="flex flex-row justify-between w-80p pt-3">
                          <p className="font-bold text-xs">Invoice Number</p>{' '}
                          <p className="text-base">{item?.invoice}</p>
                        </div>
                        <div className="flex flex-row justify-between w-80p pt-4 pb-4">
                          <p className="font-bold text-xs">{t('Invoice_Open')}</p>{' '}
                          {item?.open && (
                            <p
                              className={`text-base ${parseFloat(item?.openValue) < 0 ? 'text-green-600' : 'text-light-slate-red'}`}
                            >
                              {`${parseFloat(item?.openValue) < 0 ? '-' : ''}$${Math.abs(parseFloat(item?.openValue)).toFixed(2)}`}
                            </p>
                          )}
                          {item?.orderTotal && (
                            <p className="text-base text-light-slate-red ">
                              {`$${item?.orderTotal?.replace('$', '')}`}
                            </p>
                          )}
                        </div>
                        <div className="  border-b border-border-gray " />
                        <div className="flex flex-row justify-between w-80p pt-1">
                          <p className="font-bold text-xs">{t('Invoice_AmountAssigned')}</p>{' '}
                          <p className="text-base">{`$${Number(amountAssigned)?.toFixed(2)}`}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-span-2 md:col-start-2 md:col-span-full  flex gap-10 flex-col">
              <FormProvider {...formMethods}>
                <form onSubmit={onSubmit} className="flex flex-col gap-y-5">
                  <h4 className="text-2xl">{t('label_card_info')}</h4>
                  <div className="flex flex-col gap-y-3">
                    <div className="w-full md:max-w-80">
                      <InputFormField
                        name="cardHolderName"
                        placeholder="Payment_CardHolderName"
                        labelText=""
                      />
                    </div>

                    <div>
                      <CardPointeTokenizer
                        site={process.env.NEXT_PUBLIC_CARD_POINT_SITE as string}
                        port={process.env.NEXT_PUBLIC_CARD_POINT_PORT as string}
                        tokenProps={tokenProps}
                      />
                    </div>

                    <div className="w-full md:max-w-80">
                      <InputFormField
                        name="zipCode"
                        maxLength={5}
                        placeholder="Payment_ZipCode"
                        labelText=""
                      />
                    </div>
                  </div>
                  <div className="flex justify-left gap-6 flex-col md:flex-row">
                    <Button
                      variant={ButtonVariant.OUTLINE}
                      isTypeSubmit={false}
                      onClick={goBack}
                      disabled={isPending}
                    >
                      Back
                    </Button>
                    <Button
                      variant={ButtonVariant.BLACK}
                      isTypeSubmit={true}
                      disabled={isPending || isApiError}
                      className={`${isApiError ? 'opacity-55 hover:opacity-55 hover:bg-dark-gray' : ''}`}
                    >
                      Process Payment
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </>
        )}
        {isPaymentConfirmation && (
          <div className="col-span-2 md:col-start-2 md:col-span-full  flex gap-10 flex-col">
            <div className="flex flex-col gap-4">
              <div className="w-full hidden md:block">
                {/* Header */}
                <div className="flex ">
                  {selectedInvoices?.length > 0 && (
                    <div className="w-40 font-bold text-xs">{t('Invoice_InvoiceNumber')}</div>
                  )}
                  <div className="w-40 font-bold text-xs">{t('Invoice_AuthorizationNumber')}</div>
                  <div className="w-40 font-bold text-xs">{t('Invoice_AuthReferralCode')}</div>
                  <div className="w-40 font-bold text-xs">{t('Invoice_FADocNo')}</div>
                  <div className="w-40 font-bold text-xs">{t('Invoice_Paid')}</div>
                </div>

                {/* Body */}
                <div className="mb-11">
                  {paymentInfo?.map((row) => (
                    <div key={row?.fiDocumentNumber} className="flex">
                      {selectedInvoices?.length > 0 && (
                        <div className="w-40 pt-9 text-xs font-medium text-wrap">
                          <>
                            {selectedInvoices?.length > 0 &&
                              selectedInvoices?.map((item, _index) => {
                                return <p key={_index}>{item?.invoice}</p>;
                              })}
                          </>
                        </div>
                      )}

                      <div className="w-40 pt-9 text-xs font-medium">{row.authorizationNumber}</div>
                      <div className="w-40 pt-9 text-xs font-medium">
                        {row.authorizationRefCode}
                      </div>
                      <div className="w-40 pt-9 text-xs font-medium">{row.fiDocumentNumber}</div>
                      <div className="w-40 pt-9 text-xs font-medium">{`$${row.amountAuthorized}`}</div>
                    </div>
                  ))}
                </div>
                <div className="  border-b border-border-gray " />
                <div className="flex flex-row align-middle pt-2 pl-20 gap-8 justify-end ">
                  <p className=" w-40 font-bold text-xs">{t('Invoice_AmountAssigned')}</p>{' '}
                  <p className=" w-40 font-bold text-xs">{`$${Number(amountAssigned)?.toFixed(2)}`}</p>
                </div>
                <div className="flex w-full md:w-auto flex-col md:flex-row gap-3">
                  <Button size={SIZE.MEDIUM} onClick={handlePrint} variant={ButtonVariant.OUTLINE}>
                    {t('Cart_Print')}
                  </Button>
                  <Button size={SIZE.MEDIUM} onClick={handleCloseConfirm}>
                    {t('Cart_Close')}
                  </Button>
                </div>
              </div>
              <div className="w-full block md:hidden">
                {/* Header */}

                {/* Body */}
                <div className="mb-11">
                  {paymentInfo?.map((row) => (
                    <div key={row?.fiDocumentNumber} className="flex flex-col gap-7">
                      <div className="border-b border-border-gray">
                        <>
                          {selectedInvoices?.length === 0 && ''}
                          {selectedInvoices?.length > 0 &&
                            selectedInvoices?.map((item, _index) => {
                              return <p key={_index}>{item?.invoice}</p>;
                            })}
                        </>
                      </div>
                      <div className="flex w-full flex-row border-b border-border-gray justify-between py-6">
                        <p>Paid</p> <p>{`$${row?.amountAuthorized?.toFixed(2)}`}</p>
                      </div>
                    </div>
                  ))}
                  <div>
                    <p className="text-base font-bold mb-2 mt-8">Total Transaction</p>
                    <div className="flex flex-col gap-3 w-full border-y border-border-gray py-4">
                      <div className="w-full flex flex-row justify-between">
                        <p className="text-xs font-bold">{t('Invoice_AuthReferralCode')}</p>{' '}
                        <p className="text-base">{paymentInfo?.[0]?.authorizationRefCode}</p>
                      </div>
                      <div className="w-full flex flex-row justify-between">
                        <p className="text-xs font-bold">{t('Invoice_AuthorizationNumber')}</p>{' '}
                        <p className="text-base">{paymentInfo?.[0]?.authorizationNumber}</p>
                      </div>
                      <div className="w-full flex flex-row justify-between">
                        <p className="text-xs font-bold">{t('Invoice_FADocNo')}</p>{' '}
                        <p className="text-base">{paymentInfo?.[0]?.fiDocumentNumber}</p>
                      </div>
                      <div className="w-full flex flex-row justify-between">
                        <p className="text-xs font-bold">Amount Assigned</p>{' '}
                        <p className="text-base font-extrabold">{`$${paymentInfo?.[0]?.amountAuthorized}`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-auto flex-row gap-3">
                  <Button size={SIZE.MEDIUM} onClick={handlePrint} variant={ButtonVariant.OUTLINE}>
                    {t('Cart_Print')}
                  </Button>
                  <Button size={SIZE.MEDIUM} onClick={handleCloseConfirm}>
                    {t('Cart_Close')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(PayInvoice);

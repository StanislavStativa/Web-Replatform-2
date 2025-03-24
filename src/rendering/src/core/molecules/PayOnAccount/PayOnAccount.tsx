import React, { memo, useState } from 'react';
import { FormErrorMessages, ITypesPayOnAccount } from './PayOnAccount.type';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import { FormProvider, useForm } from 'react-hook-form';
import InputFormField from './InputFormField';
import Button from '@/core/atoms/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useI18n } from 'next-localization';
import dynamic from 'next/dynamic';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const PayInvoice = dynamic(() => import('../PayInvoice/PayInvoice'), {
  ssr: false,
  loading: () => <LoaderSpinner />,
});
const PayOnAccount = (props: ITypesPayOnAccount) => {
  const { t } = useI18n();
  const { Title, Icon, CTA } = props?.rendering?.fields;
  const { uid } = props?.rendering;
  const { HeadingTag, IsCTATextInCaps } = props?.params;

  const [isCreditForm, setIsCreditForm] = useState<boolean>(false);

  const togglePayInvoice = () => {
    setIsCreditForm(false);
  };
  const errorMessages: FormErrorMessages = {
    Error_Registration_Amount: t('Error_Registration_Amount'),
  };
  const createPaySchema = (errors: FormErrorMessages) =>
    yup.object().shape({
      amount: yup
        .number()
        .typeError(errors.Error_Registration_Amount) // This will handle the case when the value is not a number
        .required(errors.Error_Registration_Amount)
        .positive(errors.Error_Registration_Amount),
      notes: yup.string(),
    });
  const formMethods = useForm<{
    amount: number;
    notes?: string;
  }>({
    resolver: yupResolver(createPaySchema(errorMessages)),
    defaultValues: {
      amount: undefined,
      notes: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const watchAmount = formMethods.watch('amount');
  const watchNotes = formMethods.watch('notes');
  const onSubmit = formMethods.handleSubmit(() => {
    setIsCreditForm(true);
    // router.push(CTA?.value?.href as string);
  });
  return (
    <section key={uid} className="pb-17 md:my-10 md:py-14 container mx-auto px-4">
      {isCreditForm ? (
        <PayInvoice
          icon={Icon}
          goBack={togglePayInvoice}
          selectedInvoices={[]}
          amountAssigned={watchAmount}
          notes={watchNotes}
          isPayAccount
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 md:py-9 pb-13 px-4 md:px-9 bg-white  gap-y-5">
          <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
            <div className="w-full">
              <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
                <div className="flex md:items-center items-start">
                  <div className="hidden md:block w-11 h-11 mr-6">
                    <Image field={Icon} />
                  </div>
                  <Text
                    tag={HeadingTag || 'h2'}
                    className="text-left text-xl font-semibold"
                    field={Title}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-11 md:col-start-2 flex gap-10 flex-col">
            <FormProvider {...formMethods}>
              <div className="grid grid-cols-1 md:grid-cols-12">
                <form
                  onSubmit={onSubmit}
                  className="col-span-1 md:col-span-6  flex flex-col gap-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputFormField
                      name="amount"
                      placeholder="Invoice_EnterAmount"
                      labelText="Labels_Amount"
                      inputType="text"
                      isRequired
                    />
                    <InputFormField
                      name="notes"
                      placeholder="Labels_Notes"
                      labelText="Labels_PaymentNotes"
                      inputType="text"
                    />
                  </div>
                  <div className="flex justify-left mt-4 w-full">
                    <Button isTypeSubmit={true} isCTATextInCaps={IsCTATextInCaps}>
                      {CTA?.value?.title}
                    </Button>
                  </div>
                </form>
              </div>
            </FormProvider>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(PayOnAccount);

import React, { memo } from 'react';
import { ITypesPaymentWorksConfirmation } from './PaymentWorksConfirmation.type';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';

const PaymentWorksConfirmation = (props: ITypesPaymentWorksConfirmation) => {
  const { ConfirmationTitle, ConfirmationDescription, ConfirmationSubTitle } =
    props?.rendering?.fields ?? {};
  const { uid } = props?.rendering;
  return (
    <div className="container mx-auto flex justify-center px-5 md:px-10" id={uid}>
      <div className="w-650 pt-8  md:pt-14  flex flex-col pb-3 md:pb-9">
        <div className="text-center flex flex-col">
          <Text
            field={ConfirmationTitle}
            tag={'h2'}
            className="text-dark-gray text-lg font-bold md:text-2xl md:font-normal md:mb-6 mb-3"
          />
          <RichText
            field={ConfirmationDescription}
            className="max-w-lg mx-auto text-base mb-6 md:mb-7"
          />
          <RichText
            field={ConfirmationSubTitle}
            className="max-w-lg mx-auto text-base font-bold md:text-xl md:font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentWorksConfirmation);

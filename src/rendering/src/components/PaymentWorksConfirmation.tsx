import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ITypesPaymentWorksConfirmation } from '@/core/molecules/PaymentWorksConfirmation/PaymentWorksConfirmation.type';
import PaymentWorksConfirmation from '@/core/molecules/PaymentWorksConfirmation/PaymentWorksConfirmation';

const Default = (props: ITypesPaymentWorksConfirmation): JSX.Element => {
  return <PaymentWorksConfirmation {...props} />;
};
export default withDatasourceCheck()(Default);

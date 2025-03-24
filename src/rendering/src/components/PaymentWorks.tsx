import React from 'react';

import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ITypesPaymentWorks } from '@/core/molecules/PaymentWorks/PaymentWorks.type';
import PaymentWorks from '@/core/molecules/PaymentWorks/PaymentWorks';

const Default = (props: ITypesPaymentWorks): JSX.Element => {
  return <PaymentWorks {...props} />;
};
export default withDatasourceCheck()(Default);

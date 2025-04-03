import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import ForgotPassword from '@/core/molecules/ForgotPassword/ForgotPassword';
import { type ForgotPasswordFieldProps } from '@/core/molecules/ForgotPassword/ForgotPassword.types';

const Default = (props: ForgotPasswordFieldProps): JSX.Element => {
  return <ForgotPassword {...props} />;
};
export default withDatasourceCheck()(Default);

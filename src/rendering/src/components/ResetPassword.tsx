import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ResetPasswordProps } from '@/core/molecules/ResetPassword/ResetPassword.types';
import ResetPassword from '@/core/molecules/ResetPassword/ResetPassword';

const Default = (props: ResetPasswordProps): JSX.Element => {
  return <ResetPassword {...props} />;
};

export default withDatasourceCheck()(Default);

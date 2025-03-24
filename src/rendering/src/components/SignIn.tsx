import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import SignIn from '@/core/molecules/SignIn/SignIn';
import { type SignInProps } from '../core/molecules/SignIn/SignIn.types';

const Default = (props: SignInProps): JSX.Element => {
  return <SignIn {...props} />;
};
export default withDatasourceCheck()(Default);

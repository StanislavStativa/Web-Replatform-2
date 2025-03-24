import Header from '@/core/molecules/Header/Header';
import { HeaderProps } from '@/core/molecules/Header/Header.types';
import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: HeaderProps): JSX.Element => {
  return <Header {...props} />;
};
export default withDatasourceCheck()(Default);

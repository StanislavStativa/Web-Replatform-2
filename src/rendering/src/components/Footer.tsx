import React from 'react';
import Footer from '@/core/molecules/Footer/Footer';
import { FooterProps } from '@/core/molecules/Footer/Footer.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: FooterProps): JSX.Element => {
  return <Footer {...props} />;
};
export default withDatasourceCheck()(Default);

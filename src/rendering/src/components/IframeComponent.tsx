import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import Iframe from '@/core/molecules/Iframe/Iframe';
import { IframeComponentProps } from '@/core/molecules/Iframe/Iframe.types';

const Default = (props: IframeComponentProps): JSX.Element => {
  return <Iframe {...props} />;
};

export default withDatasourceCheck()(Default);

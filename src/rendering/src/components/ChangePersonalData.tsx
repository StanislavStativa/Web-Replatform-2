import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ChangePersonalDataProps } from '@/core/molecules/ChangePersonalData/ChangePersonalData.types';
import ChangePersonalData from '@/core/molecules/ChangePersonalData/ChangePersonalData';

const Default = (props: ChangePersonalDataProps): JSX.Element => {
  return <ChangePersonalData {...props} />;
};

export default withDatasourceCheck()(Default);

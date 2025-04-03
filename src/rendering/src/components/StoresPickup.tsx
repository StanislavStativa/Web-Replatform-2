import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import StoresPickup from '@/core/molecules/StoresPickup/StoresPickup';
import { StoresPickupProps } from '@/core/molecules/StoresPickup/StoresPickup.types';

const Default = (props: StoresPickupProps): JSX.Element => {
  return <StoresPickup {...props} />;
};

export default withDatasourceCheck()(Default);

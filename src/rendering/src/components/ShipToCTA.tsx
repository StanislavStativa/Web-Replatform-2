import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ShipToCTAProps } from '@/core/molecules/ShipToCTA/ShipToCTA.types';
import ShipToCTA from '@/core/molecules/ShipToCTA/ShipToCTA';

const Default = (props: ShipToCTAProps): JSX.Element => {
  return <ShipToCTA {...props} />;
};
export default withDatasourceCheck()(Default);

import React from 'react';
import RTE from '@/core/molecules//RTE';
import { type RTEProps } from '@/core/molecules/RTE/RTE.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: RTEProps): JSX.Element => {
  return <RTE {...props} />;
};
export default withDatasourceCheck()(Default);

import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import UserAuthentication from '@/core/molecules/UserAuthentication/UserAuthentication';
import { UserAuthenticationProps } from '@/core/molecules/UserAuthentication/UserAuthentication.type';

const Default = (props: UserAuthenticationProps): JSX.Element => {
  return <UserAuthentication {...props} />;
};
export default withDatasourceCheck()(Default);

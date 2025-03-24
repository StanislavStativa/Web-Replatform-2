import React from 'react';

import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import Cta from '@/core/molecules/CTA/Cta';
import { ITypesCTA } from '@/core/molecules/CTA/Cta.type';

const Default = (props: ITypesCTA): JSX.Element => {
  return <Cta {...props} />;
};

export default withDatasourceCheck()(Default);

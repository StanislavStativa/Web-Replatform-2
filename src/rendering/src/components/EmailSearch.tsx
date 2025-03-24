import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import EmailSearch from '@/core/molecules/EmailSearch/EmailSearch';
import { ITypesEmailSearch } from '@/core/molecules/EmailSearch/EmailSearch.type';

const Default = (props: ITypesEmailSearch): JSX.Element => {
  return <EmailSearch {...props} />;
};
export default withDatasourceCheck()(Default);

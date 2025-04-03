import React from 'react';

import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ITypesEditorialGallery } from '@/core/molecules/EditorialGallery/EditorialGallery.type';
import EditorialGallery from '@/core/molecules/EditorialGallery/EditorialGallery';

export const Default = (props: ITypesEditorialGallery): JSX.Element => {
  return <EditorialGallery {...props} />;
};

export default withDatasourceCheck()(Default);

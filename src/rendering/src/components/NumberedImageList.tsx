import React from 'react';
import { type NumberedImageListProps } from '@/core/molecules/NumberedImageList/NumberedImageList.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import NumberedImageList from '@/core/molecules/NumberedImageList/NumberedImageList';

const Default = (props: NumberedImageListProps): JSX.Element => {
  return <NumberedImageList {...props} />;
};
export default withDatasourceCheck()(Default);

import React from 'react';
import ContentTileStack from '@/core/molecules/ContentTileStack/ContentTileStack';
import { type ContentTileStackProps } from '@/core/molecules/ContentTileStack/ContentTileStack.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ContentTileStackProps): JSX.Element => {
  return <ContentTileStack {...props} />;
};
export default withDatasourceCheck()(Default);

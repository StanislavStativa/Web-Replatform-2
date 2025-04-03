import React from 'react';
import ContentTile from '@/core/molecules/ContentTile/ContentTile';
import { type ContentTileProps } from '@/core/molecules/ContentTile/ContentTile.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ContentTileProps): JSX.Element => {
  return <ContentTile {...props} />;
};
export default withDatasourceCheck()(Default);

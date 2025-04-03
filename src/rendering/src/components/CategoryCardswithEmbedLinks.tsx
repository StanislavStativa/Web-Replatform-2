import React from 'react';
import { EmbedLinksProps } from '@/core/molecules/CategoryCardswithEmbedLinks/CategoryCardswithEmbedLinks.type';
import CategoryCardswithEmbedLinks from '@/core/molecules/CategoryCardswithEmbedLinks/CategoryCardswithEmbedLinks';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
const Default = (props: EmbedLinksProps): JSX.Element => {
  return <CategoryCardswithEmbedLinks {...props} />;
};
export default withDatasourceCheck()(Default);

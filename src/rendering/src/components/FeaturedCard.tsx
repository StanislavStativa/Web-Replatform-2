import React from 'react';
import { FeaturedCard } from '@/core/molecules/FeaturedCard/FeaturedCard';
import { type FeaturedCardProps } from '@/core/molecules/FeaturedCard/FeaturedCard.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: FeaturedCardProps): JSX.Element => {
  return <FeaturedCard {...props} />;
};
export default withDatasourceCheck()(Default);

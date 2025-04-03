import RewardsCard from '@/core/molecules/RewardsCard/RewardsCard';
import { RewardsCardProps } from '@/core/molecules/RewardsCard/RewardsCard.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

const Default = (props: RewardsCardProps): JSX.Element => {
  return <RewardsCard {...props} />;
};

export default withDatasourceCheck()(Default);

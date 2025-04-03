import React from 'react';
import RewardsBanner from '@/core/molecules/RewardsBanner/RewardsBanner';
import { type RewardsBannerProps } from '@/core/molecules/RewardsBanner/RewardsBanner.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: RewardsBannerProps): JSX.Element => {
  return <RewardsBanner {...props} />;
};
export default withDatasourceCheck()(Default);

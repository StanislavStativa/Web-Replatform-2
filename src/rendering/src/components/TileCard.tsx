import React from 'react';
import TileCard from '@/core/molecules/TileCard/TileCard';
import { type TileCardProps } from '@/core/molecules/TileCard/TileCard.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: TileCardProps): JSX.Element => {
  return <TileCard {...props} />;
};

export default withDatasourceCheck()(Default);

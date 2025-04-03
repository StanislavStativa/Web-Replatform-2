import React from 'react';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { VideoAssetProps } from '@/core/molecules/VideoAsset/VideoAsset.types';
import VideoAsset from '@/core/molecules/VideoAsset/VideoAsset';

const Default = (props: VideoAssetProps): JSX.Element => {
  return <VideoAsset {...props} />;
};
export default withDatasourceCheck()(Default);

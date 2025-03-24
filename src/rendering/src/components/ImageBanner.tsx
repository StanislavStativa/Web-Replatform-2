import React from 'react';
import { ImageBanner } from '@/core/molecules/ImageBanner/ImageBanner';
import { type ImageBannerProps } from '@/core/molecules/ImageBanner/ImageBanner.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ImageBannerProps): JSX.Element => {
  return <ImageBanner {...props} />;
};
export default withDatasourceCheck()(Default);

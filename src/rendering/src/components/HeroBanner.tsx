import HeroBanner from '@/core/molecules/HeroBanner/HeroBanner';
import { HeroBannerProps } from '@/core/molecules/HeroBanner/HeroBanner.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { useOnlyEditor } from '@/hooks/useEditor';

const Default = (props: HeroBannerProps): JSX.Element => {
  const isEditing = useOnlyEditor();
  const isVideo = props?.rendering?.fields?.Video?.value?.href !== '';

  return <HeroBanner {...props} {...(!isEditing && !isVideo && { key: Date.now() })} />;
};

export const HeroBannerWithSecondaryCTA = (props: HeroBannerProps): JSX.Element => {
  const isVideo = props?.rendering?.fields?.Video?.value?.href !== '';
  const isEditing = useOnlyEditor();
  return <HeroBanner {...(!isEditing && !isVideo && { key: Date.now() })} {...props} />;
};

export default withDatasourceCheck()(Default);

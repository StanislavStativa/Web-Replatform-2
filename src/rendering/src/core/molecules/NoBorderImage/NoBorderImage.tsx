import React from 'react';
import type { NoBorderImageProps } from './NoBorderImage.type';
import Image from '@/core/atoms/Image/Image';
import { RichText } from '@sitecore-jss/sitecore-jss-react';
import useImageFormat from '@/hooks/useImageFormat';

export const NoBorderImage = (props: NoBorderImageProps): JSX.Element => {
  const { fields } = props?.rendering;
  const { Image: DesktopImage, TabletImage, MobileImage, ImageSmartCropFormat } = fields;

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  return (
    <div className={`container mx-auto md:px-10 ${props.params.styles}`}>
      {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
        <Image
          alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
          desktopSrc={desktopImage?.url}
          tabletSrc={tabletImage?.url}
          mobileSrc={mobileImage?.url}
          hidePinterest={false}
        />
      ) : null}
      {fields?.Caption?.value !== '' && (
        <RichText field={fields?.Caption} className="text-xs mb-3" />
      )}
    </div>
  );
};

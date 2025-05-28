import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import React, { memo } from 'react';
import Image from '@/core/atoms/Image/Image';
import Video from '@/core/atoms/Video/Video';
import { LinkFieldValue } from '@sitecore-jss/sitecore-jss-nextjs';

import LinkButton from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE } from '@/utils/constants';

type ITypesHoverImageCard = {
  mainImage: string;
  hoverImage: string;
  tabImage: string;
  tabHoverImage: string;
  isVideo: 'Hover' | 'Main' | string;
  videoSrc: string;
  link: LinkFieldValue;
  isHideLink: boolean;
  ctaColor: string;
  ctaSize: string;
};
const HoverImageCard = ({
  mainImage,
  hoverImage,
  tabHoverImage,
  tabImage,
  isVideo,
  videoSrc,
  isHideLink,
  link,
  ctaColor,
  ctaSize,
}: ITypesHoverImageCard) => {
  const desktopImage = getAdobeImageURL({
    imageName: mainImage ?? '',
  });
  const hoverDesktopImage = getAdobeImageURL({
    imageName: hoverImage ?? '',
  });
  const hoverTabletImage = getAdobeImageURL({
    imageName: tabHoverImage ?? '',
  });
  const tabletImage = getAdobeImageURL({
    imageName: tabImage ?? '',
  });

  return (
    <>
      <figure className="relative cursor-pointer w-full">
        {desktopImage?.url && isVideo !== 'Main' && (
          <Image
            alt={desktopImage?.altText || tabletImage?.altText}
            desktopSrc={desktopImage?.url}
            tabletSrc={tabletImage?.url}
            className="w-full h-full"
          />
        )}
        {videoSrc !== '' && isVideo === 'Main' && (
          <Video
            className="w-full h-full"
            videoURL={videoSrc}
            loop
            muted
            playStatus={true}
            controls={false}
          />
        )}
        {hoverDesktopImage?.url && isVideo !== 'Hover' && (
          <Image
            alt={hoverDesktopImage?.altText || hoverTabletImage?.altText}
            desktopSrc={hoverDesktopImage?.url}
            tabletSrc={hoverTabletImage?.url}
            className="absolute top-0 left-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out"
          />
        )}

        {videoSrc !== '' && isVideo === 'Hover' && (
          <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <Video
              className="videoFull w-full h-full object-cover"
              videoURL={videoSrc}
              loop
              muted
              playStatus={true}
              controls={false}
            />
          </div>
        )}
        {!isHideLink && link && link?.href !== '' && (
          <div className="absolute bottom-0 h-min w-full flex flex-col items-center justify-end mb-9">
            <LinkButton
              // className="absolute left-1/2 bottom-6"
              field={link}
              variant={(ctaColor as LinkVariant) || LinkVariant.BLACK}
              size={(ctaSize as SIZE) || SIZE?.MEDIUM}
            />
          </div>
        )}
        <figcaption className="sr-only">{desktopImage?.altText || tabletImage?.altText}</figcaption>
      </figure>
    </>
  );
};

export default memo(HoverImageCard);

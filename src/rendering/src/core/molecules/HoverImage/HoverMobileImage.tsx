import React, { memo } from 'react';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import Image from '@/core/atoms/Image/Image';
import Video from '@/core/atoms/Video/Video';
type ITypesHoverMobileImage = {
  mobileImage: string;
  isVideo: 'Hover' | 'Main' | string;
  videoSrc: string;
};
const HoverMobileImage = ({ mobileImage, isVideo, videoSrc }: ITypesHoverMobileImage) => {
  const mobileImageUrl = getAdobeImageURL({
    imageName: mobileImage ?? '',
  });
  return (
    <>
      <figure className="relative">
        {mobileImageUrl?.url && isVideo !== 'Main' && (
          <Image
            alt={mobileImageUrl?.altText}
            mobileSrc={mobileImageUrl?.url}
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

        <figcaption className="sr-only">{mobileImageUrl?.altText}</figcaption>
      </figure>
    </>
  );
};

export default memo(HoverMobileImage);

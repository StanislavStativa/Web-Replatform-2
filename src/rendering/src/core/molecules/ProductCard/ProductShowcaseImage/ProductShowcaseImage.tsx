import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import React, { memo } from 'react';
import Image from '@/core/atoms/Image/Image';

export type ITypesProductShowcaseImage = {
  imgVal: string;
};

const ProductShowcaseImage = ({ imgVal }: ITypesProductShowcaseImage) => {
  const imageUrl = getAdobeImageURL({
    imageName: imgVal ?? '',
  });

  return (
    <>
      {imageUrl?.url && (
        <figure className="relative h-full flex items-center justify-center w-auto rounded-0 hover:drop-shadow-none transition-none duration-0 ease-in-out hover:font-normal lg:max-h-64">
          <Image
            className="object-contain md:max-h-272 lg:max-h-64"
            alt={imageUrl?.altText}
            desktopSrc={imageUrl?.url}
          />
          <figcaption className="sr-only">{imageUrl?.altText}</figcaption>
        </figure>
      )}
    </>
  );
};

export default memo(ProductShowcaseImage);

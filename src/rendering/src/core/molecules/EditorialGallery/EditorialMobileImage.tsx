import React, { memo } from 'react';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import Image from '@/core/atoms/Image/Image';
import { ITypesEditorialMobileImage } from './EditorialGallery.type';
const EditorialMobileImage = ({ MobileImage }: ITypesEditorialMobileImage) => {
  const mobileImage = getAdobeImageURL({
    imageName: MobileImage?.value ?? '',
  });
  return (
    <>
      {mobileImage?.url && (
        <figure>
          <Image alt={mobileImage?.altText || mobileImage?.altText} mobileSrc={mobileImage?.url} />
        </figure>
      )}
    </>
  );
};

export default memo(EditorialMobileImage);

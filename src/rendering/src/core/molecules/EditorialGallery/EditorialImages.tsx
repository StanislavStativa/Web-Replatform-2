import React, { memo } from 'react';
import { ITypesEditorialImages } from './EditorialGallery.type';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import Image from '@/core/atoms/Image/Image';

const EditorialImages = ({ Image: DesktopImage, TabletImage }: ITypesEditorialImages) => {
  const desktopImage = getAdobeImageURL({
    imageName: DesktopImage?.value ?? '',
  });
  const tabletImage = getAdobeImageURL({
    imageName: TabletImage?.value ?? '',
  });

  return (
    <>
      {desktopImage?.url && (
        <figure>
          <Image
            alt={desktopImage?.altText || tabletImage?.altText}
            desktopSrc={desktopImage?.url}
            tabletSrc={tabletImage?.url}
          />
        </figure>
      )}
    </>
  );
};

export default memo(EditorialImages);

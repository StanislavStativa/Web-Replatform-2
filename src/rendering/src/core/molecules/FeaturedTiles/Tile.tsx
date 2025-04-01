import { RichText } from '@sitecore-jss/sitecore-jss-react';
import { type TilesFields } from './FeaturedTiles.types';
import Image from '@/core/atoms/Image/Image';
import useImageFormat from '@/hooks/useImageFormat';

const Tile = (props: TilesFields): JSX.Element => {
  const { Image: DesktopImage, MobileImage, TabletImage, ImageSmartCropFormat } = props;
  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  return (
    <div className="tiles-container md:px-6">
      {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
        <Image
          alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
          className="mb-5"
          desktopSrc={desktopImage?.url}
          tabletSrc={tabletImage?.url}
          mobileSrc={mobileImage?.url}
        />
      ) : null}
      <div className="flex  justify-center space-x-1 mb-14 break-all">
        {props?.Text.value !== '' && (
          <RichText className="rich-text text-center break_word" field={props?.Text} />
        )}
      </div>
    </div>
  );
};

export default Tile;

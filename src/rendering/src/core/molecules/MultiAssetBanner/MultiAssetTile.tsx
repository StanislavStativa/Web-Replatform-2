import { type TilesFields } from './MultiAssetBanner.types';
import Image from '@/core/atoms/Image/Image';
import useImageFormat from '@/hooks/useImageFormat';
import Link from '@/core/atoms/Link/Link';

const Tile = (props: TilesFields): JSX.Element => {
  const { Image: DesktopImage, MobileImage, TabletImage, ImageSmartCropFormat } = props;
  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  return (
    <Link field={props?.CTA} className="block">
      <Image
        alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
        className="mb-3 w-135 h-69  object-cover rounded-lg shadow-md"
        desktopSrc={desktopImage?.url}
        tabletSrc={tabletImage?.url}
        mobileSrc={mobileImage?.url}
      />
      <div className="text-sm font-latoBold text-dark-gray">{props?.CTA?.value?.text}</div>
    </Link>
  );
};

export default Tile;

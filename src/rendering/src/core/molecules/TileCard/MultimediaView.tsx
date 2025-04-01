import { type TileCardProps } from './TileCard.type';
import Image from '@/core/atoms/Image/Image';
import dynamic from 'next/dynamic';
import Link from '@/core/atoms/Link/Link';
import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

const DynamicPDFView = dynamic(() => import('./PdfView'));
const DynamicVideoView = dynamic(() => import('./VideoView'));

const MultiMediaView: React.FC<TileCardProps> = (props) => {
  const { image, altText } = props;
  const {
    params: { IsImageClickable, IsThumbnail, IsThumbnailAsPDF, IsPinterestEnable },
    fields: { SecondaryCTA } = {},
  } = props.rendering;

  if (IsThumbnailAsPDF) {
    return <DynamicPDFView {...props} />;
  }

  if (IsThumbnail) {
    return <DynamicVideoView {...props} />;
  } else {
    return (
      <>
        {IsImageClickable ? (
          <Link field={SecondaryCTA as LinkField} className="w-auto">
            <Image
              alt={altText}
              desktopSrc={image}
              tabletSrc={image}
              mobileSrc={image}
              hidePinterest={!IsPinterestEnable}
            />
          </Link>
        ) : (
          <Image
            alt={altText}
            desktopSrc={image}
            tabletSrc={image}
            mobileSrc={image}
            hidePinterest={!IsPinterestEnable}
          />
        )}
      </>
    );
  }
};

export default MultiMediaView;

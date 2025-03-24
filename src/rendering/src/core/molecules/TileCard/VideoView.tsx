import NextImage from 'next/image';
import { type TileCardProps } from './TileCard.type';
import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import videoPlayer from 'public/assets/video-play.png';
import Image from '@/core/atoms/Image/Image';
import Link from '@/core/atoms/Link/Link';

const VideoView: React.FC<TileCardProps> = (props) => {
  const { image } = props;
  const {
    params: { IsImageClickable, IsThumbnailAsPDF, IsPinterestEnable } = {},
    fields: { SecondaryCTA } = {},
  } = props.rendering;

  return (
    <>
      {IsImageClickable ? (
        <Link
          field={SecondaryCTA as LinkField}
          className="no-underline hover:font-medium w-auto flex flex-col items-start"
        >
          <div className="relative flex justify-center items-center">
            <Image
              alt="tile-card"
              desktopSrc={image}
              tabletSrc={image}
              mobileSrc={image}
              hidePinterest={!IsPinterestEnable}
            />
            {!IsThumbnailAsPDF && (
              <NextImage
                src={videoPlayer}
                alt="play-button"
                width={75}
                height={75}
                className="absolute"
              />
            )}
          </div>
          <p className="no-underline hover:underline group-hover:underline hover:font-medium w-auto mt-5">
            {SecondaryCTA?.value?.text}
          </p>
        </Link>
      ) : (
        <div className="cursor-auto w-auto flex flex-col items-start">
          <div className="relative flex justify-center items-center">
            <Image alt="tile-card" desktopSrc={image} tabletSrc={image} mobileSrc={image} />
            {!IsThumbnailAsPDF && (
              <NextImage
                src={videoPlayer}
                alt="play-button"
                width={75}
                height={75}
                className="absolute"
              />
            )}
          </div>
          <p className="hover:underline group-hover:underline hover:font-medium w-auto mt-5">
            {SecondaryCTA?.value?.text}
          </p>
        </div>
      )}
    </>
  );
};

export default VideoView;

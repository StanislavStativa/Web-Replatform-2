import { type TileCardProps } from './TileCard.type';
import Link from '@/core/atoms/Link/Link';
import { LinkField, RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { useEditor } from '@/hooks/useEditor';
import MultiMediaView from './MultimediaView';
import { cn } from '@/utils/cn';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import useImageFormat from '@/hooks/useImageFormat';

const TileCard: React.FC<TileCardProps> = (props) => {
  const isEditing = useEditor();
  const {
    params: { HeadingTag, IsImageClickable, IsThumbnail, GridParameters, IsUnderline } = {},
    fields: { Title, Description, ImageSmartCropFormat, Image, SecondaryCTA },
  } = props?.rendering;

  const imageView = getAdobeImageURL({
    imageName: Image?.value as string,
    smartCropFormat: ImageSmartCropFormat?.value,
  });

  const { desktopImage } = useImageFormat({
    BannerImage: Image,
    ImageSmartCropFormat,
    MobileImage: Image,
    TabletImage: Image,
  });

  return (
    <div className={cn('w-full', GridParameters)}>
      <div className={cn(IsImageClickable ? 'group cursor-pointer' : '')}>
        <MultiMediaView {...props} image={imageView?.url} altText={desktopImage.altText} />
        {(isEditing || Title) && (
          <Text
            tag={HeadingTag}
            field={Title}
            className={cn(
              'pt-3.5 mb-2.5 font-normal w-11/12 text-3xl',
              getHeadingStyles(props?.rendering?.fields?.HeadingSize, HeadingTag)
            )}
          />
        )}
        {(isEditing || Description) && (
          <RichText field={Description} className="w-11/12 text-base group [&>a]:hover:underline" />
        )}
        {(isEditing || (SecondaryCTA && !IsThumbnail)) && (
          <Link
            field={SecondaryCTA as LinkField}
            className={cn(
              'no-underline hover:underline group-hover:underline hover:font-medium w-auto mt-5',
              IsUnderline ? 'mt-0 underline' : ''
            )}
          />
        )}
      </div>
    </div>
  );
};

export default TileCard;

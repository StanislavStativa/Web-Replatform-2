import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ShortHeroBannerProps } from './ShortHeroBanner.type';
import { type LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE, THEME } from '@/utils/constants';
import Image from '@/core/atoms/Image/Image';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import Link from '@/core/atoms/Link/Link';
import { cn } from '@/utils/cn';

const ShortHeroBanner: React.FC<ShortHeroBannerProps> = (props) => {
  const { CTA, Title, Description } = props?.rendering?.fields;
  const { CTAColor, CTASize, GridParameters, styles, BackgroundColor, HeadingTag } = props?.params;
  // Determine background and font colors based on params

  const BgColor = cn(
    {
      'bg-none': BackgroundColor === THEME.LIGHT,
      'bg-dark-gray': BackgroundColor === THEME.DARK,
    },
    props.params.styles
  );

  const textStyles = cn('text-center', {
    'text-black': BackgroundColor === THEME.LIGHT,
    'text-white': BackgroundColor === THEME.DARK,
  });
  const image = getAdobeImageURL({
    imageName: props?.rendering?.fields?.Image?.value,
  });

  return (
    <div
      className={cn(
        'max-w-screen-xl mx-auto p-10 flex flex-col justify-center items-center',
        ShortHeroBanner,
        GridParameters,
        styles,
        textStyles,
        BgColor
      )}
    >
      <Image
        alt={image?.altText}
        className="md:w-24 w-16  rounded-lg mb-6"
        desktopSrc={image?.url}
        tabletSrc={image?.url}
        mobileSrc={image?.url}
      />
      <Text field={Title} tag={HeadingTag || 'h2'} className="mb-3 font-normal text-2xl" />
      <RichText
        className={cn(
          'text-base',
          'mb-6 text-base font-normal leading-6 text-center max-w-[700px]',
          textStyles
        )}
        field={Description}
      />
      {CTA?.value && (
        <Link
          field={CTA}
          className="font-normal text-sm hover:font-bold hover:shadow-button"
          variant={CTAColor as LinkVariant}
          size={CTASize as SIZE}
          isCTATextInCaps={props?.params?.IsCTATextInCaps}
        />
      )}
    </div>
  );
};
export default ShortHeroBanner;

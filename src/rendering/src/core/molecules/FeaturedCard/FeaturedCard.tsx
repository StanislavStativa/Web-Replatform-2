import React from 'react';
import { RichText, Text, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { SIZE, ALIGNMENT, THEME } from '@/utils/constants';
import Image from '@/core/atoms/Image/Image';
import { type FeaturedCardProps } from './FeaturedCard.types';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import LinkCTA from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { useRouter } from 'next/router';

export const FeaturedCard = (props: FeaturedCardProps): JSX.Element => {
  const id = props?.params?.RenderingIdentifier;

  const {
    Title,
    Image: FeaturedImage,
    MobileImage: MobileImg,
    TabletImage: TabletImg,
    CTA,
    Description,
    SubHeadline,
  } = props?.rendering?.fields;
  const {
    HeadingTag,
    HeadingSize,
    CTASize,
    HorizontalAlignment,
    VerticalAlignment,
    BackgroundColor,
    CTAColor,
    Opacity,
    styles = '',
  } = props?.params || {};
  const sectionStyles = cn(
    'flex relative overflow-hidden w-full h-full min-h-44 md:min-h-96',
    {
      'bg-tonal-gray ': BackgroundColor === THEME.LIGHT,
      'bg-dark-gray ': BackgroundColor === THEME.DARK,
    },
    styles
  );

  const router = useRouter();

  const isLightBackground = BackgroundColor === THEME.LIGHT;
  const textColorClass = isLightBackground ? 'text-black' : 'text-white';

  const positionClass = cn({
    'md:justify-start': VerticalAlignment === ALIGNMENT.TOP,
    'md:justify-center': VerticalAlignment === ALIGNMENT.CENTER,
    'md:items-center': HorizontalAlignment === ALIGNMENT.CENTER,
    'md:items-end': HorizontalAlignment === ALIGNMENT.BOTTOM,
    'md:justify-end': VerticalAlignment !== ALIGNMENT.CENTER,
    'md:items-start': HorizontalAlignment !== ALIGNMENT.CENTER,
  });

  const desktopImage = getAdobeImageURL({
    imageName: FeaturedImage?.value,
  });
  const mobileImage = getAdobeImageURL({
    imageName: MobileImg?.value,
  });
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext.pageEditing;

  const tabletImage = getAdobeImageURL({
    imageName: TabletImg?.value,
  });

  return (
    <section className={`group rounded-xl cursor-pointer ${sectionStyles}`} id={id}>
      <span
        className={cn(
          'absolute h-96 w-full left-0 transform transition duration-500 group-hover:scale-106 bottom-0',
          {
            [`opacity-${Opacity}`]: Opacity !== null,
          }
        )}
      >
        {desktopImage && (
          <Image
            alt={desktopImage?.altText || mobileImage?.altText}
            className={cn(`h-full w-full object-cover`)}
            desktopSrc={desktopImage?.url}
            mobileSrc={mobileImage?.url ? mobileImage?.url : desktopImage?.url}
            tabletSrc={tabletImage?.url ? tabletImage?.url : desktopImage?.url}
          />
        )}
      </span>
      <div
        onClick={() =>
          !isPageEditing &&
          CTA?.value?.href &&
          CTA?.value?.href !== '' &&
          router.push(CTA?.value?.href)
        }
        className={`flex flex-col p-10 w-full h-full z-10 items-start justify-end ${positionClass}`}
        title={desktopImage?.altText || mobileImage?.altText}
      >
        <RichText className={`mb-4 ${textColorClass}`} field={SubHeadline} />
        {Title && (
          <Text
            className={`mb-4 md:mb-8 font-latoLight ${textColorClass} ${getHeadingStyles(HeadingSize, HeadingTag)}`}
            tag={HeadingTag || 'h2'}
            field={Title}
          />
        )}
        <RichText
          className={`hidden md:block mb-5 md:mb-10  ${textColorClass}`}
          field={Description}
        />
        {CTA?.value?.text && (
          <LinkCTA
            field={CTA}
            className="group-hover:font-latoBold py-3 px-6 min-w-32 min-h-10 text-left"
            variant={CTAColor as LinkVariant}
            size={CTASize as SIZE}
            isCTATextInCaps={props?.params?.IsCTATextInCaps}
          />
        )}
      </div>
    </section>
  );
};

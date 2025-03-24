import React, { useEffect } from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import { cn } from '@/utils/cn';
import { ALIGNMENT, THEME } from '@/utils/constants';
import { type ContentTileProps } from '../ContentTile/ContentTile.types';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { RiPinterestLine } from 'react-icons/ri';
import Link from '@/core/atoms/Link/Link';
import useImageFormat from '@/hooks/useImageFormat';

const ContentTile: React.FC<ContentTileProps> = (props) => {
  const {
    CTA,
    Title,
    Description,
    SectionTitle,
    Image: DesktopImage,
    MobileImage,
    TabletImage,
    ImageSmartCropFormat,
  } = props?.rendering?.fields;

  const {
    GridParameters,
    styles,
    BackgroundColor,
    HeadingTag,
    IsImageOnRight,
    AlignContentRight,
    SectionHeadingTag,
    Opacity,
  } = props?.params;

  const textStyles = cn({
    'text-black': BackgroundColor === THEME.LIGHT,
    'text-white': BackgroundColor === THEME.DARK,
  });

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  useEffect(() => {
    document.querySelectorAll('.text-underline').forEach(function (element) {
      if (element.textContent) {
        element.textContent = element.textContent.toLowerCase().replace(/(^|\s)\S/g, function (t) {
          return t.toUpperCase();
        });
      }
    });
  });

  return (
    <div
      className={cn(
        'max-w-screen-xl mx-auto md:p-10 pt-4 md:pb-10 px-4 flex flex-col md:flex-row items-center',
        IsImageOnRight ? 'md:flex-row-reverse' : '',
        GridParameters,
        styles,
        textStyles,
        props?.isStack &&
          (desktopImage?.url || tabletImage?.url || mobileImage?.url) &&
          props?.className,
        !props?.isStack && {
          'bg-none': BackgroundColor === THEME.LIGHT,
          'bg-dark-gray': BackgroundColor === THEME.DARK,
        }
      )}
    >
      <div
        className={cn(
          'w-full block md:hidden px-4',
          AlignContentRight ? 'text-right' : 'text-left'
        )}
      >
        {Title && (
          <div title={Title?.value}>
            <Text
              field={Title}
              tag={HeadingTag || 'h2'}
              className={cn(
                'text-underline',
                'mb-3 font-normal',
                getHeadingStyles(
                  `${props?.TitleHeadingSize ? props?.TitleHeadingSize : HeadingTag}`,
                  HeadingTag
                ),
                {
                  'text-right': props.params.TitleAlignment === ALIGNMENT.RIGHT,
                  'text-left': props.params.TitleAlignment === ALIGNMENT.LEFT,
                  'text-center': props.params.TitleAlignment === ALIGNMENT.CENTER,
                  'text-justify': props.params.TitleAlignment === ALIGNMENT.JUSTIFY,
                  'text-start': props.params.TitleAlignment === ALIGNMENT.TOP,
                  'text-end': props.params.TitleAlignment === ALIGNMENT.BOTTOM,
                }
              )}
            />
          </div>
        )}
      </div>
      {desktopImage?.url || tabletImage?.url || mobileImage?.url ? (
        <Link
          field={CTA}
          className="md:w-1/2 group flex relative mx-4 w-full h-full"
          title="category-card"
        >
          <Image
            alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
            className={cn('rounded-lg mb-6 ', {
              'rounded-none w-full h-full max-w-full': props?.isStack,
              [`hover:opacity-${Opacity}`]: Opacity !== null,
            })}
            desktopSrc={desktopImage?.url}
            tabletSrc={tabletImage?.url}
            mobileSrc={mobileImage?.url}
          />
          {props?.isStack && !CTA?.value?.href && (
            <div className="bg-red-600 flex flex-row gap-1 justify-center items-center opacity-0 group-hover:opacity-100 absolute top-0 left-0 m-2 rounded p-1 text-white">
              <RiPinterestLine className="bg-red-600 rounded w-4 h-4" />
              <span className="text-xs font-bold mr-1">Save</span>
            </div>
          )}
        </Link>
      ) : null}
      <div
        className={cn('md:w-1/2 p-4 lg:text-left', AlignContentRight ? 'text-right' : 'text-left', {
          'md:px-12': props.isStack,
        })}
      >
        {props?.rendering?.fields?.Label && (
          <RichText
            className={cn('text-base mb-6 font-normal leading-6', textStyles)}
            field={props?.rendering?.fields.Label}
          />
        )}
        {SectionTitle && (
          <Text
            field={SectionTitle}
            tag={SectionHeadingTag}
            className={cn('text-underline', getHeadingStyles(SectionHeadingTag, SectionHeadingTag))}
          />
        )}
        <div className="hidden md:block">
          {Title && (
            <div title={Title?.value}>
              <Text
                field={Title}
                tag={HeadingTag || 'h2'}
                className={cn(
                  'text-underline',
                  'mb-3 font-normal capitalize',
                  getHeadingStyles(
                    `${props?.TitleHeadingSize ? props?.TitleHeadingSize : HeadingTag}`,
                    HeadingTag
                  ),
                  {
                    'text-right': props.params.TitleAlignment === ALIGNMENT.RIGHT,
                    'text-left': props.params.TitleAlignment === ALIGNMENT.LEFT,
                    'text-center': props.params.TitleAlignment === ALIGNMENT.CENTER,
                    'text-justify': props.params.TitleAlignment === ALIGNMENT.JUSTIFY,
                    'text-start': props.params.TitleAlignment === ALIGNMENT.TOP,
                    'text-end': props.params.TitleAlignment === ALIGNMENT.BOTTOM,
                  }
                )}
              />
            </div>
          )}
        </div>
        <RichText
          className={cn('text-base', 'mb-6 font-normal leading-6 truncate-multiline', textStyles)}
          field={Description}
        />
        {CTA && (
          <Link
            field={CTA}
            className={cn('hover:font-semibold text-dark-gray', props?.buttonStyle)}
          />
        )}
      </div>
    </div>
  );
};

export default ContentTile;

import React from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type HeroBannerProps } from './HeroBanner.types';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import Link from '@/core/atoms/Link/Link';
import Image from '@/core/atoms/Image/Image';
import Video from '@/core/atoms/Video/Video';
import { ALIGNMENT, SIZE, THEME } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { getStyles } from '@/utils/StyleParams';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { useOnlyEditor } from '@/hooks/useEditor';
import useImageFormat from '@/hooks/useImageFormat';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';

const HeroBanner: React.FC<HeroBannerProps> = (props) => {
  const id = props?.params?.RenderingIdentifier;

  const {
    Title,
    Description,
    CTA,
    SecondaryCTA,
    Image: BannerImage,
    ImageSmartCropFormat,
    Video: BannerVideo,
    TabletVideo,
    MobileVideo,
    Label,
    MobileImage,
    TabletImage,
    EnableVideoPlayerControls,
    TextColor,
  } = props?.rendering?.fields || {};

  const {
    HeadingTag,
    HeadingSize,
    HorizontalAlignment,
    VerticalAlignment,
    BackgroundColor,
    CTAColor,
    CTASize,
    Opacity,
    FieldNames,
    CTAHoverEffect,
  } = props?.params || {};
  const isEditing = useOnlyEditor();

  let linkVariant = LinkVariant.BLACK;

  if (CTAColor?.length) {
    if (CTAColor === LinkVariant.OUTLINE) {
      switch (BackgroundColor) {
        case THEME.LIGHT:
          linkVariant = LinkVariant.OUTLINE;
          break;
        default:
          linkVariant = LinkVariant.OUTLINE_WHITE;
          break;
      }
    } else {
      linkVariant = CTAColor as LinkVariant;
    }
  } else {
    switch (BackgroundColor) {
      case THEME.LIGHT:
        linkVariant = LinkVariant.BLACK;
        break;
      default:
        linkVariant = LinkVariant.WHITE;
        break;
    }
  }

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
    deviceType: props.isInspirationBanner,
    useDeviceSmartCrops: true,
  });

  const deviceType = useDeviceType();

  const isMobile: boolean = deviceType === DeviceType.Mobile;
  const isTablet: boolean = deviceType === DeviceType.Tablet;

  let videoSRC;

  if (isMobile) {
    videoSRC = MobileVideo?.value?.href ?? '';
  } else if (isTablet) {
    videoSRC = TabletVideo?.value?.href ?? '';
  } else {
    videoSRC = BannerVideo?.value?.href ?? '';
  }

  const isSolidBanner: boolean = FieldNames === 'HeroBannerWithSecondaryCTA';
  const isCTAHover: boolean = CTAHoverEffect === ('1' || 'true');
  return (
    <section
      style={{
        backgroundColor: props?.rendering?.fields?.BackgroundColor?.value,
        color: TextColor?.value,
      }}
      className={cn(
        'flex relative overflow-hidden container mx-auto w-full min-h-100  px-4 pb-6 pt-10 md:py-40 md:px-36',
        {
          'lg:min-h-550': desktopImage?.url?.length > 0 || videoSRC?.length > 0,
        },
        {
          'px-0 pt-28 md:py-32 md:px-16 !text-dark-gray finance-banner':
            props?.params?.FinanceBanner === '1',
        },
        {
          'md:justify-start': HorizontalAlignment === ALIGNMENT.LEFT,
          'md:justify-end': HorizontalAlignment === ALIGNMENT.RIGHT,
          'md:justify-center': HorizontalAlignment === ALIGNMENT.CENTER,
        },
        {
          'items-start': VerticalAlignment === ALIGNMENT.TOP,
          'items-end': VerticalAlignment === ALIGNMENT.BOTTOM,
          'items-center': VerticalAlignment === ALIGNMENT.CENTER,
        },
        {
          'bg-tonal-gray text-black': BackgroundColor === THEME.LIGHT,
          'bg-dark-gray text-white': BackgroundColor === THEME.DARK,
        },
        {
          'md:py-20': props?.isInspirationBanner,
        },
        // {
        //    'md:pt-20 pb-28 md:mx-10': isSolidBanner,
        // },
        props?.params?.styles?.includes('pro-tutorial-hero') ? 'md:py-20' : '',
        props?.params?.styles?.includes('no-padding')
          ? '!mx-0'
          : isSolidBanner
            ? 'md:pt-20 pb-28 md:mx-10'
            : '',
        props?.params?.styles,
        getStyles(props)
      )}
      id={id}
    >
      <div className="absolute h-full w-full left-0 top-0">
        {videoSRC?.length ? (
          <Video
            videoURL={videoSRC}
            className={cn({
              'max-w-none md:max-w-full md:!h-auto !w-auto md:!w-ful':
                EnableVideoPlayerControls?.value === false,
            })}
            playStatus={true}
            loop={true}
            muted={true}
            controls={EnableVideoPlayerControls?.value}
          />
        ) : BannerImage?.value?.length > 0 ? (
          <Image
            alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
            className={cn('h-full w-full object-cover object-left', {
              [`opacity-${Opacity}`]: Opacity !== null,
              'object-center md:object-left lg:object-center': props?.params?.FinanceBanner === '1',
            })}
            desktopSrc={desktopImage?.url}
            tabletSrc={tabletImage?.url}
            mobileSrc={mobileImage?.url}
            hidePinterest={
              props?.params?.IsPinterestEnable?.length > 0 && props.params.IsPinterestEnable === '1'
                ? false
                : true
            }
            priority={true}
          />
        ) : null}
      </div>
      <div
        className={cn(
          'flex flex-col gap-10 items-center z-10 w-full md:max-w-80p',
          { 'bg-white md:bg-transparent': props?.params?.FinanceBanner === '1' },
          {
            'md:items-start': HorizontalAlignment === ALIGNMENT.LEFT,
            'md:items-end': HorizontalAlignment === ALIGNMENT.RIGHT,
            'md:items-center': HorizontalAlignment === ALIGNMENT.CENTER,
          },
          {
            'mx-auto md:max-w-540': props?.isInspirationBanner,
          },
          {
            'mx-auto': isSolidBanner,
          }
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-5 md:gap-8',
            {
              'sm:w-600 !gap-y-6 md:py-6 md:px-7 bg-white py-3.5 px-5': props?.isInspirationBanner,
            },
            {
              'md:gap-12 py-0 w-44 md:w-full': isSolidBanner,
            },
            {
              'md:items-start': HorizontalAlignment === ALIGNMENT.LEFT,
              'md:items-end': HorizontalAlignment === ALIGNMENT.RIGHT,
              'md:items-center': HorizontalAlignment === ALIGNMENT.CENTER,
            },
            {
              'px-7 md:px-0': props?.params?.FinanceBanner === '1',
            }
          )}
        >
          {Label?.value?.length && (
            <Text className="text-sm md:text-lg font-latoBold text-dark-gray" field={Label} />
          )}
          <Text
            className={cn(
              {
                'md:text-center': HorizontalAlignment === ALIGNMENT.CENTER,
                'md:text-left': HorizontalAlignment === ALIGNMENT.LEFT,
                'md:text-right': HorizontalAlignment === ALIGNMENT.RIGHT,
              },
              {
                'text-white': CTAColor === THEME.LIGHT,
                'text-black': CTAColor === THEME.DARK,
              },
              {
                'font-latoLight text-left text-dark-gray': props?.isInspirationBanner,
              },
              props?.params?.FinanceBanner === '1'
                ? `text-center font-latoLight text-40 leading-10`
                : `text-center ${getHeadingStyles(HeadingSize, HeadingTag)}`
              // ,
              // {
              //   'w-60 md:w-full': isSolidBanner,
              // }
            )}
            field={Title}
            tag={HeadingTag || 'h2'}
          />
          {props?.isInspirationBanner && <hr className="w-14 border-dark-gray leading-none" />}
          <RichText
            className={cn(
              'text-base text-center max-w-72 md:max-w-452',
              {
                'md:text-center': HorizontalAlignment === ALIGNMENT.CENTER,
                'md:text-left': HorizontalAlignment === ALIGNMENT.LEFT,
                'md:text-right': HorizontalAlignment === ALIGNMENT.RIGHT,
              },
              {
                'text-white': CTAColor === THEME.LIGHT,
                'text-black': CTAColor === THEME.DARK,
              },
              {
                'max-w-full md:max-w-540 text-justify font-normal text-base md:pb-0.5 tracking-wider leading-5 md:leading-30 text-dark-gray':
                  props?.isInspirationBanner,
              },
              {
                'max-w-full': isSolidBanner,
              },
              { 'max-w-full md:max-w-452': props?.params?.FinanceBanner === '1' },
              props?.params?.styles?.includes('pro-tutorial-hero') ? 'md:max-w-[80%]' : ''
            )}
            field={Description}
          />
          <div
            className={cn('flex flex-row gap-3 md:gap-y-12 justify-center', {
              'flex-col justify-center': isSolidBanner,
              'md:justify-start': HorizontalAlignment === ALIGNMENT.LEFT,
              'md:justify-end': HorizontalAlignment === ALIGNMENT.RIGHT,
              'md:justify-center': HorizontalAlignment === ALIGNMENT.CENTER,
            })}
          >
            {CTA?.value?.text || isEditing ? (
              <Link
                field={CTA}
                variant={linkVariant}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                size={CTASize as SIZE}
                className={cn({
                  'text-sm w-fit text-center uppercase px-4 py-4 md:px-10 md:py-6 place-self-center border-2 hover:border-white hover:bg-transparent':
                    isSolidBanner,
                })}
                isCTAHoverEffect={isCTAHover}
              />
            ) : null}

            <div
              className={cn({
                'flex place-content-center group text-center px-6 md:px-0': isSolidBanner,
              })}
            >
              {SecondaryCTA?.value?.text || isEditing ? (
                <Link
                  field={SecondaryCTA}
                  variant={linkVariant}
                  size={CTASize as SIZE}
                  isCTATextInCaps={props?.params?.IsCTATextInCaps}
                  className={cn({
                    'block text-base uppercase border-none hover:border-none place-self-center hover:bg-transparent hover:font-normal px-0 py-0 group-hover:underline after:content-[">"]':
                      isSolidBanner,
                  })}
                  isCTAHoverEffect={isCTAHover}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

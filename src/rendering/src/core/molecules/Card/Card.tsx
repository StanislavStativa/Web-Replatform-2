import { type TextAndImageCardProps } from './Card.type';
import { Field, RichText, Text, Link as JssLink } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from '@/core/atoms/Link/Link';
import LinkCTA from '@/core/atoms/Link/Link';
import ImageCTA from '@/core/atoms/Image/Image';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { BLOGDISPLAY, SIZE, THEME } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import useImageFormat from '@/hooks/useImageFormat';
import { useEditor } from '@/hooks/useEditor';
import NextImage from '@/core/atoms/Image/Image';
const TextAndImageCard = (props: TextAndImageCardProps) => {
  const {
    Title,
    Description,
    CTA,
    MobileTitle,
    MobileDescription,
    Image,
    MobileImage,
    TabletImage,
    HoverImage,
    MobileHoverImage,
    TabletHoverImage,
    ImageSmartCropFormat,
  } = props?.rendering?.fields ?? {};
  const { BackgroundColor, CTAColor, CTASize, Styles, IsBorder } = props?.params ?? {};
  const isEditing = useEditor();
  const TitleText: Field<string> = useDeviceType() === DeviceType.Mobile ? MobileTitle : Title;
  const DescriptionText: Field<string> =
    useDeviceType() === DeviceType.Mobile ? MobileDescription : Description;

  const { desktopImage, mobileImage, tabletImage } = useImageFormat({
    BannerImage: Image || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });

  const {
    desktopImage: hoverDesktopImage,
    mobileImage: hoverMobileImage,
    tabletImage: hoverTabletImage,
  } = useImageFormat({
    BannerImage: HoverImage || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileHoverImage || { value: '' },
    TabletImage: TabletHoverImage || { value: '' },
  });
  const ImageIcon = props?.params?.IsIcon
    ? `max-w-44 px-14 md:max-h-44 md:max-w-72 md:px-16 w-full h-full ${isEditing && 'h-40 w-40 '}`
    : `${isEditing && 'min-h-96 min-w-96'} `;

  return (
    <div
      className={cn(`container mx-auto md:flex md:justify-center`, {
        'p-10': props?.isNoImage,
        'py-6 px-3 border border-dark-gray border-opacity-35 rounded-xl': IsBorder,
      })}
    >
      <div
        className={cn('flex flex-col items-center gap-6 relative', {
          'bg-none': BackgroundColor === THEME.LIGHT,
          'bg-dark-gray': BackgroundColor === THEME.DARK,
        })}
      >
        {!props?.isNoImage && Image?.value && !isEditing ? (
          <>
            {CTA?.value?.href?.replace(/^\/+/, '')?.toLocaleLowerCase() === BLOGDISPLAY ? (
              <JssLink
                field={{
                  value: {
                    href: `${process.env.NEXT_PUBLIC_URL}${CTA?.value?.href?.replace(/^\/+/, '')}`,
                  },
                }}
                aria-label={CTA?.value?.text}
                title={CTA?.value?.text}
                className={`relative group ${BackgroundColor === THEME.DARK ? '' : 'md:max-w-full'} ${ImageIcon} `}
                style={CTA?.value?.href === '' ? { pointerEvents: 'none' } : {}}
              >
                <ImageCTA
                  alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
                  className={cn('object-fill h-full w-full', {
                    'group-hover:invisible': HoverImage?.value,
                  })}
                  desktopSrc={desktopImage?.url}
                  mobileSrc={mobileImage?.url}
                  tabletSrc={tabletImage?.url}
                />
                {HoverImage?.value && (
                  <ImageCTA
                    alt={
                      hoverDesktopImage?.altText ||
                      hoverTabletImage?.altText ||
                      hoverMobileImage?.altText
                    }
                    className={cn('absolute top-0 left-0 object-fill h-full w-full invisible', {
                      'group-hover:visible': HoverImage?.value,
                    })}
                    desktopSrc={hoverDesktopImage?.url}
                    mobileSrc={hoverMobileImage?.url}
                    tabletSrc={hoverTabletImage?.url}
                  />
                )}
              </JssLink>
            ) : (
              <Link
                field={CTA}
                aria-label={CTA?.value?.text}
                title={CTA?.value?.text}
                className={`relative group ${BackgroundColor === THEME.DARK ? '' : 'md:max-w-full'} ${ImageIcon} `}
                style={CTA?.value?.href === '' ? { pointerEvents: 'none' } : {}}
              >
                <ImageCTA
                  alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
                  className={cn('object-fill h-full w-full', {
                    'group-hover:invisible': HoverImage?.value,
                  })}
                  desktopSrc={desktopImage?.url}
                  mobileSrc={mobileImage?.url}
                  tabletSrc={tabletImage?.url}
                />
                {HoverImage?.value && (
                  <ImageCTA
                    alt={
                      hoverDesktopImage?.altText ||
                      hoverTabletImage?.altText ||
                      hoverMobileImage?.altText
                    }
                    className={cn('absolute top-0 left-0 object-fill h-full w-full invisible', {
                      'group-hover:visible': HoverImage?.value,
                    })}
                    desktopSrc={hoverDesktopImage?.url}
                    mobileSrc={hoverMobileImage?.url}
                    tabletSrc={hoverTabletImage?.url}
                  />
                )}
              </Link>
            )}
          </>
        ) : null}

        {!props?.isNoImage && Image?.value && isEditing && (
          <span
            aria-label={CTA?.value?.text}
            title={CTA?.value?.text}
            className={`h-full relative group inline-flex items-center justify-center rounded-md transition-all duration-100 ease-in-out text-black group max-w-44 px-14 md:max-h-44 md:max-w-72 md:px-16 w-full ${BackgroundColor === THEME.DARK ? '' : 'md:max-w-full'} ${ImageIcon} `}
          >
            <ImageCTA
              alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
              className={cn('absolute top-0 left-0 object-contain h-full w-full', {
                'group-hover:invisible': HoverImage?.value,
              })}
              desktopSrc={desktopImage?.url}
              mobileSrc={mobileImage?.url}
              tabletSrc={tabletImage?.url}
            />
            {HoverImage?.value && (
              <ImageCTA
                alt={
                  hoverDesktopImage?.altText ||
                  hoverTabletImage?.altText ||
                  hoverMobileImage?.altText
                }
                className={cn('absolute top-0 left-0 object-fill h-full w-full invisible', {
                  'group-hover:visible': HoverImage?.value,
                })}
                desktopSrc={hoverDesktopImage?.url}
                mobileSrc={hoverMobileImage?.url}
                tabletSrc={hoverTabletImage?.url}
              />
            )}
          </span>
        )}
        {props?.rendering?.fields?.Icon?.value?.src && (
          <NextImage
            field={{
              value: {
                src: props?.rendering?.fields?.Icon?.value?.src,
                alt: props?.rendering?.fields?.Icon?.value?.alt,
                width: Number(props?.rendering?.fields?.Icon?.value?.width) || 60, // Set default width
                height: Number(props?.rendering?.fields?.Icon?.value?.height) || 60, // Set default height
              },
            }}
          />
        )}

        <div className="flex flex-col items-center gap-2 w-30 text-center w-full">
          {Title?.value?.length > 0 ? (
            <Text
              field={MobileTitle?.value?.length ? TitleText : Title}
              tag={props?.params?.HeadingTag || 'h2'}
              className={cn(
                'text-xl md:text-2xl',
                {
                  'text-black': BackgroundColor === THEME.LIGHT,
                  'text-white': BackgroundColor === THEME.DARK,
                },
                {
                  'font-medium [&>h3]:text-base [&>h3]:md:text-xl': props?.isNoImage,
                }
              )}
            />
          ) : null}
          {Description?.value?.length > 0 ? (
            <RichText
              field={MobileDescription?.value?.length ? DescriptionText : Description}
              className={cn(
                `text-base ${Styles}`,
                {
                  'text-black': BackgroundColor === THEME.LIGHT,
                  'text-white': BackgroundColor === THEME.DARK,
                },
                {
                  '[&>h3]:text-base [&>h3]:md:text-xl': props?.isNoImage,
                },
                {
                  'min-w-72 mx-2': IsBorder,
                }
              )}
            />
          ) : null}
        </div>
        {CTA ? (
          <>
            {CTA?.value?.href?.replace(/^\/+/, '')?.toLocaleLowerCase() === BLOGDISPLAY ? (
              <JssLink
                field={{
                  value: {
                    href: `${process.env.NEXT_PUBLIC_URL}${CTA?.value?.href?.replace(/^\/+/, '')}`,
                  },
                }}
                className="inline-flex items-center w-auto h-max rounded-md transition-all duration-100 ease-in-out border-dark-gray text-dark-gray py-3 px-6 font-latoRegular text-sm justify-around border-2 hover:font-latoBold hover:text-black hover:border-black"
              >
                {CTA?.value?.text}
              </JssLink>
            ) : (
              <LinkCTA
                field={CTA}
                variant={CTAColor as LinkVariant}
                size={CTASize as SIZE}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                className="font-latoRegular text-sm justify-around border-2  hover:font-latoBold"
                linkTitle={CTA?.value?.text}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TextAndImageCard;

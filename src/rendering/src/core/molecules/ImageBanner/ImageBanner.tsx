import React, { ReactElement, useEffect, useState } from 'react';
// import Link from '@/core/atoms/Link/Link';
import Image from '@/core/atoms/Image/Image';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import { type ImageBannerProps } from './ImageBanner.types';
import Video from '@/core/atoms/Video/Video';
import { cn } from '@/utils/cn';
import { PRICE_GP } from '@/config';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useOnlyEditor } from '@/hooks/useEditor';
export const ImageBanner = (props: ImageBannerProps): JSX.Element => {
  const id = props?.params?.RenderingIdentifier;
  const isEditing = useOnlyEditor();
  const {
    Image: ImageBanner,
    TabletImage: TabletImageBanner,
    MobileImage: MobileImageBanner,
    CTA,
    Video: ImageBannerVideo,
  } = props?.rendering?.fields;
  const desktopImage = getAdobeImageURL({
    imageName: ImageBanner?.value,
  });
  const tabletImage = getAdobeImageURL({
    imageName: TabletImageBanner?.value,
  });

  const mobileImage = getAdobeImageURL({
    imageName: MobileImageBanner?.value,
  });
  const videoSRC = ImageBannerVideo?.value?.href || '';
  const hover = props?.params?.HoverEffect;
  const hoverClass = hover === '1' ? 'hover:shadow-imageBannerShadow cursor-pointer' : '';
  const isClickable = props?.params?.IsComponentClickable === '1';
  const [Pricing_group_tier, setIsProUser] = useState<string>('');

  useEffect(() => {
    const proUserCookie = Cookies.get(PRICE_GP);
    if (proUserCookie !== undefined) setIsProUser(proUserCookie);
  }, [Pricing_group_tier]);

  const Wrapper = ({ children }: { children: ReactElement }) => {
    return isClickable && isEditing === false ? (
      <NextLink
        href={CTA?.value?.href as string}
        aria-label={ImageBanner?.value}
        title={ImageBanner?.value}
      >
        {children}
      </NextLink>
    ) : (
      <>{children}</>
    );
  };
  return (
    <div
      className={cn(
        ` overflow-hidden w-full container mx-auto ${props?.params?.Styles?.includes('no-padding') ? '' : 'px-5 md:px-10'} ${(hover === '1' || hover === 'true') && 'md:py-1'} ${props?.params?.styles}`
      )}
      id={id ? id : undefined}
    >
      <div className="h-full w-full">
        <Wrapper>
          {videoSRC?.length > 0 ? (
            <Video
              videoURL={videoSRC}
              className=" [&>video]:md:max-w-full [&>video]:md:!h-auto [&>video]:!w-auto [&>video]:md:!w-full"
              playStatus={true}
              loop={true}
              muted={true}
            />
          ) : (
            <>
              {Pricing_group_tier === 'RETAIL' &&
              props?.params?.IsVisibleForRetailsUsers === 'false' ? null : (
                <Image
                  alt={desktopImage?.altText || mobileImage?.altText || tabletImage?.altText}
                  className={`h-full w-full object-cover rounded-xl ${hoverClass}`}
                  mobileSrc={mobileImage?.url}
                  desktopSrc={desktopImage?.url}
                  tabletSrc={tabletImage?.url}
                />
              )}
            </>
          )}
        </Wrapper>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { type LinkItem, type EmbedLinksProps } from './CategoryCardswithEmbedLinks.type';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { LinkField, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import Close from '@/core/atoms/Icons/Close';
import Link from '@/core/atoms/Link/Link';
import { DeviceType, useDeviceType } from '@/hooks/useDeviceType';
import CategoryCardOverlay from './CategoryCardOverlay';
import { cn } from '@/utils/cn';
import useImageFormat from '@/hooks/useImageFormat';

const CategoryCardswithEmbedLinks = (props: EmbedLinksProps): JSX.Element => {
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;
  const styles = props.params.GridParameters ?? '';
  const {
    uid,
    params: { HeadingTag = 'h2', Opacity } = {},
    fields: {
      Title,
      CTA,
      Description,
      Links,
      ImageSmartCropFormat,
      Image: CardImage,
      MobileImage,
      TabletImage,
    } = {},
  } = props.rendering;

  const [expanded, setExpanded] = useState<boolean>(false);
  const [imageMinHeight, setImageMinHeight] = useState<number>(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const imageMinHeightFromRef = imageRef.current?.clientHeight ?? 0;

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: CardImage || { value: '' },
    ImageSmartCropFormat: ImageSmartCropFormat || { value: '' },
    MobileImage: MobileImage || { value: '' },
    TabletImage: TabletImage || { value: '' },
  });

  useEffect(() => {
    if (imageMinHeightFromRef) {
      setImageMinHeight(imageMinHeightFromRef);
    }
  }, [imageMinHeightFromRef, isMobile]);

  return (
    <div className={`${styles} w-full`}>
      <div className="gap-5">
        <div className=" flex justify-between items-center w-full lg:px-0 px-7 mb-3">
          <Link field={CTA as LinkField} className="no-underline hover:underline">
            <Text
              field={Title}
              tag={HeadingTag}
              className="lg:text-3xl sm:text-2xl text-xl font-light font-latoLight "
            />
          </Link>
          <button
            aria-label="expand"
            className="md:hidden flex"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <Close width={20} height={20} />
            ) : (
              <IoEllipsisHorizontal className="w-6 h-6" />
            )}
          </button>
        </div>
        {CardImage?.value && (
          <div
            className={cn(
              'md:mb-12 relative h-auto bg-cover transition-all duration-500 ease-in-out max-h-[1000px]'
            )}
            style={{
              backgroundImage: isMobile ? `url(${mobileImage})` : 'none',
              minHeight: isMobile ? imageMinHeight : 0,
            }}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <CategoryCardOverlay
              Description={Description}
              Links={Links as LinkItem[]}
              opacity={Opacity}
              expanded={expanded}
            />
            <div
              id={uid}
              ref={imageRef}
              className={cn(
                'overflow-hidden absolute z-10 top-0 md:static md:z-0 ',
                imageMinHeight && isMobile && ''
              )}
            >
              <Image
                alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
                desktopSrc={desktopImage?.url}
                tabletSrc={tabletImage?.url}
                mobileSrc={mobileImage?.url}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCardswithEmbedLinks;

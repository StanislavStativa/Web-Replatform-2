import React, { ReactElement } from 'react';
import Link from '@/core/atoms/Link/Link';
import Image from '@/core/atoms/Image/Image';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type CategoryCardListFieldProps } from './CategoryCard.types';
import { SIZE } from '@/utils/constants';
import { cn } from '@/utils/cn';
import useImageFormat from '@/hooks/useImageFormat';
import { useEditor } from '@/hooks/useEditor';

const CategoryCard: React.FC<CategoryCardListFieldProps> = ({
  id,
  fields,
  Layout,
  HeadingTag,
  CTAHoverEffect,
  ImageClass,
  isClickable,
  IsPinterestShow,
}) => {
  const { Image: DesktopImage, MobileImage, TabletImage, ImageSmartCropFormat } = fields;

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  const imageContainerStyles = cn('relative flex justify-center ', {
    'min-w-36 min-h-44': Layout === SIZE.SMALL,
    'min-w-48 min-h-56': Layout === SIZE.MEDIUM,
    'min-w-72 min-h-80': Layout === SIZE.LARGE,
  });

  const isHoverableCardStyles = cn('no-underline  h-auto w-full hover:drop-shadow-none', {
    'group hover:scale-106 hover:shadow-custom hover:font-latoBold transition-all duration-60 ease-out':
      CTAHoverEffect === '1' || CTAHoverEffect === 'true',
  });
  const isEditing = useEditor();

  const Wrapper = ({ children }: { children: ReactElement }) => {
    return isClickable && !isEditing ? (
      <Link
        field={fields?.CTA}
        linkTitle={fields?.CTA?.value?.title}
        className={isHoverableCardStyles}
      >
        {children}
      </Link>
    ) : (
      <div className={isHoverableCardStyles}>{children}</div>
    );
  };
  return (
    <div key={id} className="flex justify-center ">
      <div className={imageContainerStyles}>
        <Wrapper>
          <div className="flex justify-center">
            <div>
              <div className="px-2 pt-2 flex justify-center">
                {isEditing || fields?.Image?.value?.length > 0 ? (
                  <Image
                    alt={desktopImage?.altText || tabletImage?.altText || mobileImage?.altText}
                    className={cn('lg:w-32 lg:h-32 object-cover rounded-lg', ImageClass)}
                    desktopSrc={desktopImage?.url}
                    tabletSrc={tabletImage?.url}
                    mobileSrc={mobileImage?.url}
                    hidePinterest={
                      IsPinterestShow?.length > 0 && IsPinterestShow === '1' ? false : true
                    }
                  />
                ) : null}
              </div>
              <Text
                field={fields?.Title}
                tag={HeadingTag}
                className={cn('text-center py-2 text-base', {
                  'hover:font-latoBold': CTAHoverEffect === '1' || CTAHoverEffect === 'true',
                })}
              />
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
};

export default CategoryCard;

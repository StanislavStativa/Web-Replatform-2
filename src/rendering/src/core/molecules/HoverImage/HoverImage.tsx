import React, { Fragment, memo, useMemo } from 'react';
import { ITypesHoverImage } from './HoveImage.type';
import { cn } from '@/utils/cn';
import HoverImageCard from './HoverImageCard';
import HoverMobileImage from './HoverMobileImage';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useOnlyEditor } from '@/hooks/useEditor';
import { getHoverImageAssets } from './utils/hoveImageHelpers';
import LinkButton from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE } from '@/utils/constants';
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const CustomDot = ({ active }: { active?: boolean }) => (
  <div
    style={{
      width: active ? '8px' : '6px',
      height: active ? '8px' : '6px',
      backgroundColor: active ? '#ffffff' : '#65656559',
      borderRadius: '50%',
      margin: active ? '0px 5px 12px' : '1px 5px 12px',
      transition: 'all 0.2s ease',
      border: active ? '1px solid #65656559' : 'none',
    }}
  />
);

const HoverImage = ({ rendering }: ITypesHoverImage) => {
  const { uid, fields, params } = rendering ?? {};
  const { CTAColor, CTASize } = params ?? {};
  const isEditing = useOnlyEditor();
  const hoverImageAssets = useMemo(() => getHoverImageAssets(fields), [fields]);
  const filteredAssets = hoverImageAssets.filter((item) => item?.MobileImage?.mainImage !== '');

  return (
    <div className={cn('flex flex-row items-center justify-center gap-4 mx-3 py-2')} key={uid}>
      {hoverImageAssets.length > 0 && (
        <section className="hidden md:flex flex-row justify-center items-center max-w-1280 gap-x-3">
          {hoverImageAssets
            ?.filter((item) => {
              if (item.isVideo === 'Main') {
                // Only include if videoSrc is not an empty string
                return item?.videoSrc && item?.videoSrc?.trim() !== '';
              } else {
                // Only include if mainImage is not an empty string
                return item.Image.mainImage && item.Image.mainImage.trim() !== '';
              }
            })
            ?.map((item, index) => (
              <HoverImageCard
                key={index}
                mainImage={item.Image.mainImage}
                hoverImage={item.Image.hoverImage}
                tabImage={item.TabletImage.mainImage}
                tabHoverImage={item.TabletImage.hoverImage}
                isVideo={item.isVideo}
                videoSrc={item.videoSrc ?? ''}
                link={item.link}
                isHideLink={item.isHideLink}
                ctaColor={CTAColor}
                ctaSize={CTASize}
              />
            ))}
        </section>
      )}

      {filteredAssets.length > 0 && (
        <section className="md:hidden w-full h-full hover-carousel">
          <Carousel
            responsive={responsive}
            swipeable
            showDots={filteredAssets.length > 1}
            keyBoardControl
            removeArrowOnDeviceType={isEditing ? ['desktop'] : ['tablet', 'mobile']}
            customDot={<CustomDot />}
          >
            {filteredAssets.map((item, index) => (
              <Fragment key={index}>
                <HoverMobileImage
                  key={index}
                  mobileImage={item.MobileImage.mainImage}
                  isVideo={item.isVideo}
                  videoSrc={item.videoSrc ?? ''}
                />
                {!item?.isHideLink && item?.link && item?.link?.href !== '' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-end mb-9">
                    <LinkButton
                      field={item?.link}
                      variant={(CTAColor as LinkVariant) || LinkVariant.BLACK}
                      size={(CTASize as SIZE) || SIZE?.MEDIUM}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </Carousel>
        </section>
      )}
    </div>
  );
};

export default memo(HoverImage);

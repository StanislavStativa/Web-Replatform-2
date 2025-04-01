import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type CarouselViewProps } from './ProductImageGallery.type';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { cn } from '@/utils/cn';
import { FaPlay } from 'react-icons/fa';

const ProductImageRightCarousel: React.FC<CarouselViewProps> = (props) => {
  const { data, activeSlick = 0, setActiveSlick, mainRef, isMainImageDragged } = props;
  const [carouselDimensions, setCarouselDimensions] = useState<{
    fixedWidth: number;
    fixedHeight: number;
  }>({ fixedWidth: 100, fixedHeight: 100 });
  const splideRef = useRef<Splide>(null);

  const handleThumbnailClick = (index: number) => {
    setActiveSlick(index);
    if (mainRef?.current) {
      mainRef.current.go(index);
    } else {
      console.warn('mainRef.current is null on click');
    }
  };

  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;

    let fixedWidth = 100;
    let fixedHeight = 100;

    if (width >= 1024) {
      fixedWidth = 100;
      fixedHeight = 100;
    } else if (width <= 1024 && width >= 820) {
      fixedWidth = 50;
      fixedHeight = 50;
    } else if (width <= 820 && width >= 768) {
      fixedWidth = 46;
      fixedHeight = 46;
    } else if (width <= 768 && width >= 712) {
      fixedWidth = 136;
      fixedHeight = 136;
    } else if (width <= 712 && width >= 480) {
      fixedWidth = 78;
      fixedHeight = 78;
    } else if (width <= 480 && width >= 425) {
      fixedWidth = 65;
      fixedHeight = 65;
    } else if (width <= 425 && width > 375) {
      fixedWidth = 52;
      fixedHeight = 52;
    } else if (width <= 375 && width >= 360) {
      fixedWidth = 48;
      fixedHeight = 48;
    } else {
      fixedWidth = 38;
      fixedHeight = 38;
    }

    setCarouselDimensions({ fixedWidth, fixedHeight });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (isMainImageDragged) {
      splideRef?.current?.go(activeSlick);
    }
  }, [isMainImageDragged, activeSlick]);

  return (
    <div className="w-full mt-5 lg:mt-5 lg:w-25 md:mb-10 right-carousel">
      <div className="flex flex-row lg:flex-col items-center justify-center mb-5 md:mt-7 lg:mb-0 lg:mt-0">
        <Splide
          ref={splideRef}
          options={{
            type: 'slide',
            initialSlide: activeSlick,
            perPage: 4,
            fixedWidth: carouselDimensions.fixedWidth,
            fixedHeight: carouselDimensions.fixedHeight,
            isNavigation: false,
            gap: 10,
            direction: window.innerWidth >= 1024 ? 'ttb' : 'ltr',
            height: window.innerWidth >= 1024 ? '430px' : 'auto',
            width: window.innerWidth >= 1024 ? 'auto' : '100%',
            pagination: false,
            cover: true,
            arrows: data?.ImageGalleryAssets?.length > 4 ? true : false,
          }}
        >
          {data?.ImageGalleryAssets?.map((item, index) => (
            <SplideSlide
              key={index}
              className={cn('cursor-pointer')}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="p-0.5">
                {item.type?.toLowerCase() === 'video' ? (
                  <div className="relative cursor-pointer">
                    <img
                      src={`${item?.url}?$PDPThumbnail$&fmt=webp`}
                      alt="slider"
                      className={cn(
                        'border border-light-border-gray focus:outline-none cursor-pointer',
                        index === activeSlick ? 'border-search-gray' : ''
                      )}
                    />
                    <span className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white bg-opacity-50 border-none rounded-full w-12 h-12 cursor-pointer ">
                      <FaPlay className="text-gray w-6 h-6" />
                    </span>
                  </div>
                ) : (
                  <img
                    src={`${item?.url}?$PDPThumbnail$&fmt=webp`}
                    alt="slider"
                    className={cn(
                      'border border-light-border-gray focus:outline-none cursor-pointer',
                      index === activeSlick ? 'border-search-gray' : ''
                    )}
                  />
                )}
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
};

export default ProductImageRightCarousel;

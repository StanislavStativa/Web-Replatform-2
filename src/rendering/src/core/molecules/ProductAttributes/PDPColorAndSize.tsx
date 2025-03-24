import React, { useEffect, useRef, useState } from 'react';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useI18n } from 'next-localization';
import { type ProductAttributesProps } from './ProductAttributes.types';
import { cn } from '@/utils/cn';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useRouter } from 'next/router';
type ArrowProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

const CustomArrowLeft = ({ onClick, disabled }: ArrowProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute left-1.2m md:left-2.5m top-1/2 transform -translate-y-1/2 z-30 text-gray-700 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{ background: 'none' }}
  >
    <IoIosArrowBack style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const CustomArrowRight = ({ onClick, disabled }: ArrowProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute right-1.2m md:right-2.5m top-1/2 transform -translate-y-1/2 z-30 text-gray-700 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{ background: 'none' }}
  >
    <IoIosArrowForward style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const PDPColorAndSize: React.FC<ProductAttributesProps> = (data) => {
  const router = useRouter();
  const { t } = useI18n();
  const carouselRef = useRef<MultiCarousel | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const [isslideismoved, setisslideismoved] = useState(false);
  const variantShapeAndSize = data?.data.SizeShape || [];

  useEffect(() => {
    // Only initialize the carousel to the active slide on the initial load
    const activeIndex = variantShapeAndSize.findIndex((item) => item.IsActive);

    if (carouselRef.current && activeIndex !== -1 && !isslideismoved) {
      const nextSlide =
        carouselRef.current.state.currentSlide + activeIndex > 0 ? activeIndex - 1 : activeIndex;
      carouselRef.current.goToSlide(nextSlide, true);
      setisslideismoved(true);
    }
    if (variantShapeAndSize?.length <= 2) {
      setIsAtStart(false);
      setIsAtEnd(false);
    } else if (
      carouselRef.current &&
      carouselRef?.current.state.currentSlide === variantShapeAndSize?.length - 2
    ) {
      setIsAtEnd(false);
    }
  }, [variantShapeAndSize]);

  const handlePrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.previous(1);
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next(1);
    }
  };

  const updateCarouselState = () => {
    setIsAtStart(true);
    setIsAtEnd(true);
    if (carouselRef.current && carouselRef.current.state.currentSlide === 0) {
      setIsAtStart(false);
    } else if (
      carouselRef.current &&
      carouselRef.current.state.currentSlide === variantShapeAndSize?.length - 2
    ) {
      setIsAtEnd(false);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1,
    },
  };

  const handleButtonClick = (url: string) => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <div className="variant">
      {variantShapeAndSize.length > 0 && (
        <div className="mt-10 variant-shapeandsize w-full relative">
          <h2 className="font-latoBold md:font-latoRegular text-lg md:text-2xl mb-4 text-dark-gray">
            {t('PDPAttributes_SizeShape')}
          </h2>
          <div className="relative">
            {isAtStart && <CustomArrowLeft onClick={handlePrevious} />}
            <MultiCarousel
              ref={carouselRef}
              responsive={responsive}
              infinite={false}
              autoPlay={false}
              showDots={false}
              arrows={false}
              afterChange={() => {
                updateCarouselState();
              }}
            >
              {variantShapeAndSize.map((card, index) => (
                <div key={index} className="px-2 relative">
                  <button
                    onClick={() => handleButtonClick(card?.ProductUrl)}
                    className={cn(
                      'max-w-2000 mb-1.5 dark-gray bg-white border-dark-gray text-center w-full border inline-block no-underline font-normal rounded-lg py-2 text-sm transition duration-100 relative',
                      card.IsActive
                        ? 'text-white bg-dark-gray border border-dark-gray cursor-auto'
                        : !card.Enabled
                          ? 'bg-button-gray border border-gray-500 text-gray'
                          : 'hover:border-black hover:text-black hover:shadow-md hover:font-bold hover:font-latoBold'
                    )}
                  >
                    <p className="text-sm">{card?.ProductTitle}</p>
                    <p className="text-sm text-gray-500">{card?.ProductSubTitle}</p>
                  </button>
                </div>
              ))}
            </MultiCarousel>
            {isAtEnd && <CustomArrowRight onClick={handleNext} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDPColorAndSize;

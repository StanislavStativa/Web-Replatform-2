import React, { useEffect, useRef, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { cn } from '@/utils/cn';
import { useI18n } from 'next-localization';
import { type ProductAttributesProps } from './ProductAttributes.types';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import 'react-multi-carousel/lib/styles.css';
import Link from '@/core/atoms/Link/Link';
interface ArrowProps {
  onClick: () => void;
}

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute right-1.2m md:right-2.5m  top-55p transform -translate-y-1/2 z-10"
    onClick={onClick}
    style={{ background: 'none', border: 'none' }}
  >
    <IoIosArrowForward style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute left-1.2m md:left-2.5m top-55p transform -translate-y-1/2 z-10"
    onClick={onClick}
    style={{ background: 'none', border: 'none' }}
  >
    <IoIosArrowBack style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const PDPColor: React.FC<ProductAttributesProps> = (data) => {
  const { t } = useI18n();
  const splideRef = useRef<Splide | null>(null);
  const variantColors = data?.data.Colors || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (splideRef.current) {
      // Get the index of the active item
      const activeIndex = variantColors.findIndex((color) => color.IsActive);
      if (activeIndex >= 0) {
        // Scroll or jump to the active item
        splideRef.current?.go(activeIndex);
        setCurrentIndex(activeIndex);
      }
    }
  }, [variantColors]);

  const handleMove = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  return (
    <div className="variant">
      {variantColors.length > 0 && (
        <div className="mt-10 splide-wrapper relative">
          <h3 className="font-latoBold md:font-latoRegular text-lg md:text-2xl mb-5 text-dark-gray">
            {t('PDPAttributes_Color')}
          </h3>
          <Splide
            ref={splideRef}
            options={{
              perPage: 3,
              perMove: 2,
              focus: 0,
              omitEnd: true,
              rewind: false,
              arrows: false,
              pagination: false,
            }}
            aria-label="React Splide Example"
            onMoved={(newIndex) => handleMove(newIndex?.index)}
          >
            {variantColors.map((color, index) => (
              <SplideSlide key={index}>
                <div
                  className={`variant-item variant-item-image ${color.Enabled ? '' : 'disabled'} relative`}
                >
                  {color?.IsActive ? (
                    <div
                      className={cn(
                        'flex flex-col items-center w-full text-center text-dark-gray p-2 no-underline rounded-lg mr-0.5',
                        color.IsActive
                          ? 'text-decoration-none !cursor-default font-latoBold shadow-md transition duration-[0.06s] ease-out border border-solid border-dark-gray p-2 text-dark-gray'
                          : 'cursor-pointer'
                      )}
                    >
                      <div className="variant-item-image-wrapper relative min-h-24 min-w-24 text-center">
                        <img
                          src={color?.ProductImage}
                          alt={`Color swatch ${color?.ProductTitle}`}
                          className={cn(
                            'max-h-[92px] w-auto mx-auto rounded-md h-[92px] transition duration-75 ease-out',
                            !color.IsActive && color.Enabled
                              ? 'hover:h-24 hover:max-h-24 hover:transition-[0.06s] hover:ease-out'
                              : ''
                          )}
                        />
                      </div>
                      {color?.ProductTitle.length > 9 && !color?.ProductTitle.includes(' ') ? (
                        <div className="text-dark-gray">{color.ProductTitle}</div>
                      ) : color?.ProductTitle.split(' ').some((word) => word.length > 9) ? (
                        <div>
                          {color.ProductTitle.split(' ').map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`${color.Enabled ? 'text-dary-gray' : 'text-olive-gray '} my-1 text-center text-sm w-24`}
                        >
                          {color?.ProductTitle}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      field={{ href: color.IsActive ? '#' : color.ProductUrl ?? '' }}
                      className={cn(
                        'flex flex-col items-center w-full text-center text-dark-gray p-2 no-underline rounded-lg mr-0.5',
                        color.IsActive
                          ? 'text-decoration-none !cursor-default font-latoBold shadow-md transition duration-[0.06s] ease-out border border-solid border-dark-gray p-2 text-dark-gray'
                          : 'cursor-pointer'
                      )}
                    >
                      <div className="variant-item-image-wrapper relative min-h-24 min-w-24 text-center">
                        <img
                          src={color?.ProductImage}
                          alt={`Color swatch ${color?.ProductTitle}`}
                          className={cn(
                            'max-h-[92px] w-auto mx-auto rounded-md h-[92px] transition duration-75 ease-out',
                            !color.IsActive && color.Enabled
                              ? 'hover:h-24 hover:max-h-24 hover:transition-[0.06s] hover:ease-out'
                              : ''
                          )}
                        />
                      </div>
                      {color?.ProductTitle.length > 9 && !color?.ProductTitle.includes(' ') ? (
                        <div className="text-dark-gray">{color.ProductTitle}</div>
                      ) : color?.ProductTitle.split(' ').some((word) => word.length > 9) ? (
                        <div>
                          {color.ProductTitle.split(' ').map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`${color.Enabled ? 'text-dary-gray' : 'text-olive-gray '} my-1 text-center text-sm w-24`}
                        >
                          {color?.ProductTitle}
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              </SplideSlide>
            ))}
          </Splide>
          {currentIndex > 0 && variantColors.length >= 4 && (
            <CustomPrevArrow onClick={() => splideRef.current?.go('<')} />
          )}
          {currentIndex < variantColors.length - 3 && variantColors.length >= 4 && (
            <CustomNextArrow onClick={() => splideRef.current?.go('>')} />
          )}
        </div>
      )}
    </div>
  );
};

export default PDPColor;

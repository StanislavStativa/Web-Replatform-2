import React, { useEffect, useRef, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { cn } from '@/utils/cn';
import { useI18n } from 'next-localization';
import { type ProductAttributesProps } from './ProductAttributes.types';
import { Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import Link from '@/core/atoms/Link/Link';
interface ArrowProps {
  onClick: () => void;
}

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute right-1.2m md:right-2.5m  top-1/2 transform -translate-y-1/2 z-10"
    onClick={onClick}
    style={{ background: 'none', border: 'none' }}
  >
    <IoIosArrowForward style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute left-1.2m md:left-2.5m top-1/2 transform -translate-y-1/2 z-10"
    onClick={onClick}
    style={{ background: 'none', border: 'none' }}
  >
    <IoIosArrowBack style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const PDPCollections: React.FC<ProductAttributesProps> = (props) => {
  const { data } = props;
  const { t } = useI18n();
  const variantCollection = data?.Collection || [];
  const splideRef = useRef<Splide | null>(null);
  const text: TextField = {
    value: t('PDPAttributes_AvailableInThisCollection'),
  };
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (splideRef.current) {
      // Get the index of the active item
      const activeIndex = variantCollection.findIndex((colllection) => colllection.IsActive);
      if (activeIndex >= 0) {
        // Scroll or jump to the active item
        splideRef.current?.go?.(activeIndex);
        setCurrentIndex(activeIndex);
      }
    }
  }, [variantCollection]);

  const handleMove = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };
  return (
    <div className="variant-collection">
      {variantCollection.length > 0 && (
        <div className="mt-10 splide-wrapper relative">
          <Text
            field={text}
            tag={props?.params?.HeadingTag || 'h2'}
            className={cn(
              'mb-5 text-dark-gray',
              getHeadingStyles(props?.params?.HeadingSize, props?.params?.HeadingTag)
            )}
          />
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
            aria-label="Collection"
            onMoved={(newIndex) => handleMove(newIndex?.index)}
          >
            {variantCollection.map((collection, index) => (
              <SplideSlide key={index}>
                <div className="flex">
                  {collection.IsActive ? (
                    <div
                      className={cn(
                        'flex flex-col items-center text-center text-dark-gray py-2 no-underline rounded-lg mb-2.5 mr-0.5',
                        collection.IsActive
                          ? 'text-decoration-none cursor-default font-latoBold shadow-md transition duration-60 ease-out border border-solid text-dark-gray py-2'
                          : props?.params.HoverEffect === '1'
                            ? 'hover:shadow-lg hover:font-latoBold cursor-pointer'
                            : ''
                      )}
                    >
                      <div className="variant-item-image-wrapper relative min-h-40 min-w-40 text-center">
                        <img
                          src={collection.ProductImage}
                          alt={`Color swatch ${collection.ProductTitle}`}
                          className={cn(
                            'max-h-36 w-auto mx-auto rounded-md h-36 transition duration-75 ease-out',
                            !collection.IsActive
                              ? props?.params.HoverEffect === '1'
                                ? 'hover:h-[155px] hover:max-h-[155px] hover:transition-[0.06s] hover:ease-out'
                                : ''
                              : ''
                          )}
                        />
                      </div>
                      <div className="my-1 text-center text-dark-gray text-base">
                        {collection?.ProductTitle}
                      </div>
                    </div>
                  ) : (
                    <Link
                      field={{ href: collection?.IsActive ? '#' : collection.ProductUrl ?? '' }}
                      title={collection.IsActive ? undefined : collection.ProductTitle}
                      className={cn(
                        'flex flex-col items-center text-center text-dark-gray py-2 no-underline rounded-lg mb-2.5 mr-0.5',
                        collection.IsActive
                          ? 'text-decoration-none cursor-default font-latoBold shadow-md transition duration-60 ease-out border border-solid text-dark-gray py-2'
                          : props?.params.HoverEffect === '1'
                            ? 'hover:shadow-lg hover:font-latoBold cursor-pointer'
                            : ''
                      )}
                    >
                      <div className="variant-item-image-wrapper relative min-h-40 min-w-40 text-center">
                        <img
                          src={collection.ProductImage}
                          alt={`Color swatch ${collection.ProductTitle}`}
                          className={cn(
                            'max-h-36 w-auto mx-auto rounded-md h-36 transition duration-75 ease-out',
                            !collection.IsActive
                              ? props?.params.HoverEffect === '1'
                                ? 'hover:h-[155px] hover:max-h-[155px] hover:transition-[0.06s] hover:ease-out'
                                : ''
                              : ''
                          )}
                        />
                      </div>
                      <div className="my-1 text-center text-dark-gray text-base">
                        {collection?.ProductTitle}
                      </div>
                    </Link>
                  )}
                </div>
              </SplideSlide>
            ))}
          </Splide>
          {currentIndex > 0 && variantCollection.length >= 3 && (
            <CustomPrevArrow onClick={() => splideRef.current?.go('<')} />
          )}
          {currentIndex < variantCollection.length - 3 && variantCollection.length >= 3 && (
            <CustomNextArrow onClick={() => splideRef.current?.go('>')} />
          )}
        </div>
      )}
    </div>
  );
};

export default PDPCollections;

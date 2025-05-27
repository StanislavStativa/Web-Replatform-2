import React, { memo, useEffect, useRef } from 'react';
import { Text, RichText, TextField, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useOnlyEditor } from '@/hooks/useEditor';
import EditorialImages from '../../EditorialGallery/EditorialImages';
import EditorialMobileImage from '../../EditorialGallery/EditorialMobileImage';
import { ITypesImageArray } from '../../EditorialGallery/EditorialGallery.type';

export type ITypesProductEditorialDisplay = {
  title: {
    jsonValue: TextField;
  };
  description: {
    jsonValue: RichTextField;
  };
  editorialImages: ITypesImageArray[];
};

const ProductEditorialDisplay = ({
  title,
  description,
  editorialImages,
}: ITypesProductEditorialDisplay) => {
  const isEditing = useOnlyEditor();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const CustomDot = ({ active }: { active?: boolean }) => {
    return (
      <div
        style={{
          width: active ? '8px' : '6px',
          height: active ? '8px' : '6px',
          backgroundColor: active ? '#656565' : '#65656559',
          borderRadius: '50%',
          margin: '0 5px',
          marginBottom: '12px',
          transition: 'all 0.2s ease',
        }}
      />
    );
  };
  useEffect(() => {
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start', // scroll to top of element
    });
  }, [title?.jsonValue?.value]);
  return (
    <article
      ref={sectionRef}
      className={cn(`flex flex-col items-center justify-center w-full h-full gap-4`)}
    >
      <section className="hidden md:flex flex-row justify-center items-center gap-3 max-w-992">
        {editorialImages?.map((child, index) => (
          <EditorialImages
            key={index}
            Image={child?.Image?.jsonValue}
            TabletImage={child?.TabletImage?.jsonValue}
          />
        ))}
      </section>
      {editorialImages?.length > 0 && (
        <section className="md:hidden w-full h-full">
          <Carousel
            responsive={responsive}
            swipeable={true}
            showDots={editorialImages?.length > 1 ? true : false}
            keyBoardControl={true}
            removeArrowOnDeviceType={isEditing ? ['desktop'] : ['tablet', 'mobile']}
            customDot={<CustomDot />}
          >
            {editorialImages?.map((child, index) => (
              <EditorialMobileImage key={index} MobileImage={child?.MobileImage?.jsonValue} />
            ))}
          </Carousel>
        </section>
      )}

      <header className="md:mt-7">
        <Text
          field={title?.jsonValue}
          tag={'h2'}
          className={cn(`text-center leading-none md:leading-none text-dark-gray`)}
        />
      </header>
      <section>
        <RichText
          field={description?.jsonValue}
          className={cn(`text-center max-w-740 text-base text-dark-gray`)}
        />
      </section>
    </article>
  );
};

export default memo(ProductEditorialDisplay);

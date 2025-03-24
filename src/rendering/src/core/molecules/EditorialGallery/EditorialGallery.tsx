import React, { memo } from 'react';
import { ITypesEditorialGallery } from './EditorialGallery.type';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { Text, RichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { cn } from '@/utils/cn';
import EditorialImages from './EditorialImages';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import EditorialMobileImage from './EditorialMobileImage';
import { useOnlyEditor } from '@/hooks/useEditor';
const EditorialGallery = (props: ITypesEditorialGallery) => {
  const { Title, BackgroundColor, Description, children } =
    props?.rendering?.fields?.data?.dataSource ?? {};
  const isEditing = useOnlyEditor();
  const { uid } = props?.rendering;
  const { HeadingTag, HeadingSize, TextMode } = props?.params ?? {};
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
  return (
    <article
      id={uid}
      style={{
        backgroundColor: BackgroundColor?.jsonValue.value,
      }}
      className={cn(
        `flex flex-col items-center justify-center w-full h-full gap-4 p-6 lg:px-36 lg:py-20`
      )}
    >
      <section className="hidden md:flex flex-row justify-center items-center gap-3 max-w-992">
        {children?.results?.map((child, index) => (
          <EditorialImages
            key={index}
            Image={child?.Image?.jsonValue}
            TabletImage={child?.TabletImage?.jsonValue}
          />
        ))}
      </section>
      {children?.results?.length > 0 && (
        <section className="md:hidden w-full h-full">
          <Carousel
            responsive={responsive}
            swipeable={true}
            showDots={children?.results?.length > 1 ? true : false}
            keyBoardControl={true}
            removeArrowOnDeviceType={isEditing ? ['desktop'] : ['tablet', 'mobile']}
            customDot={<CustomDot />}
          >
            {children?.results?.map((child, index) => (
              <EditorialMobileImage key={index} MobileImage={child?.MobileImage?.jsonValue} />
            ))}
          </Carousel>
        </section>
      )}

      <header className="md:mt-7">
        <Text
          field={Title?.jsonValue}
          tag={HeadingTag || 'h2'}
          className={cn(
            `text-center ${getHeadingStyles(HeadingSize, HeadingTag)} leading-none md:leading-none`,
            TextMode && TextMode === 'Light' ? `text-white` : 'text-dark-gray'
          )}
        />
      </header>
      <section>
        <RichText
          field={Description?.jsonValue}
          className={cn(
            `text-center max-w-740 text-base`,
            TextMode && TextMode === 'Light' ? `text-white` : 'text-dark-gray'
          )}
        />
      </section>
    </article>
  );
};

export default memo(EditorialGallery);

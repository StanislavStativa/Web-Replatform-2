import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ITypesProductCard, ITypesThumbnailObj } from './ProductCard.type';
import { cn } from '@/utils/cn';
import { useDeviceType, DeviceType } from '@/hooks/useDeviceType';
import ProductShowcaseImage from './ProductShowcaseImage/ProductShowcaseImage';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import ProductsThumbnail from './ProductsThumbnail/ProductsThumbnail';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { FiPlus, FiMinus } from 'react-icons/fi';
import ProductEditorialDisplay from './ProductCollections/ProductEditorialDisplay';
import ProductKits from './ProductCollections/ProductKits/ProductKits';
import ProductCollectionCarousel from './ProductCollections/ProductCollectionCarousel';

const ProductCard = (props: ITypesProductCard) => {
  const {
    BackgroundColor,
    Heading,
    KitOptionText,
    ButtonText,
    ThumbnailImage1,
    ThumbnailImage2,
    ThumbnailImage3,
    ThumbnailImage4,
    ThumbnailImage5,
    ThumbnailImage6,
    ThumbnailImage7,
    ThumbnailImage8,
    HideSubMenu,
    ExtendedImageDescription,
    ExtendedImageHeading,
    ExtendedImageDesktopImage1,
    ExtendedImageDesktopImage2,
    ExtendedImageDesktopImage3,
    ExtendedImageMobileImage1,
    ExtendedImageMobileImage2,
    ExtendedImageMobileImage3,
    ExtendedImageTabletImage1,
    ExtendedImageTabletImage2,
    ExtendedImageTabletImage3,
    children,
    ExtendedProductCarouselButtonFunctionality,
    ExtendedProductCarouselDefaultItemsPerPageDesktop,
    ExtendedProductCarouselDefaultItemsPerPageMobile,
    ExtendedProductCarouselDiscoverRfkId,
    ExtendedProductCarouselTitle,
    ExtendedProductCarouselButtonText,
    HideThumbnailImages,
    MainThumbnailImage,
  } = props?.rendering?.fields?.data?.dataSource ?? {};

  const { uid } = props?.rendering;
  const isMobile: boolean = useDeviceType() === DeviceType.Mobile;
  const isTablet: boolean = useDeviceType() === DeviceType.Tablet;
  const isDesktop: boolean = useDeviceType() === DeviceType.Desktop;

  const editorialImages = useMemo(() => {
    return [
      {
        Image: {
          jsonValue: {
            value: ExtendedImageDesktopImage1?.jsonValue?.value,
          },
        },
        MobileImage: {
          jsonValue: {
            value: ExtendedImageMobileImage1?.jsonValue?.value,
          },
        },
        TabletImage: {
          jsonValue: {
            value: ExtendedImageTabletImage1?.jsonValue?.value,
          },
        },
      },
      {
        Image: {
          jsonValue: {
            value: ExtendedImageDesktopImage2?.jsonValue?.value,
          },
        },
        MobileImage: {
          jsonValue: {
            value: ExtendedImageMobileImage2?.jsonValue?.value,
          },
        },
        TabletImage: {
          jsonValue: {
            value: ExtendedImageTabletImage2?.jsonValue?.value,
          },
        },
      },
      {
        Image: {
          jsonValue: {
            value: ExtendedImageDesktopImage3?.jsonValue?.value,
          },
        },
        MobileImage: {
          jsonValue: {
            value: ExtendedImageMobileImage3?.jsonValue?.value,
          },
        },
        TabletImage: {
          jsonValue: {
            value: ExtendedImageTabletImage3?.jsonValue?.value,
          },
        },
      },
    ];
  }, [
    ExtendedImageDesktopImage1,
    ExtendedImageDesktopImage2,
    ExtendedImageDesktopImage3,
    ExtendedImageMobileImage1,
    ExtendedImageMobileImage2,
    ExtendedImageMobileImage3,
    ExtendedImageTabletImage1,
    ExtendedImageTabletImage2,
    ExtendedImageTabletImage3,
  ]);
  const thumbnailImgArr = useMemo(() => {
    return [
      {
        imgUrl: ThumbnailImage1?.jsonValue?.value,
        id: '1',
      },
      {
        imgUrl: ThumbnailImage2?.jsonValue?.value,
        id: '2',
      },
      {
        imgUrl: ThumbnailImage3?.jsonValue?.value,
        id: '3',
      },
      {
        imgUrl: ThumbnailImage4?.jsonValue?.value,
        id: '4',
      },
      {
        imgUrl: ThumbnailImage5?.jsonValue?.value,
        id: '5',
      },
      {
        imgUrl: ThumbnailImage6?.jsonValue?.value,
        id: '6',
      },
      {
        imgUrl: ThumbnailImage7?.jsonValue?.value,
        id: '7',
      },
      {
        imgUrl: ThumbnailImage8?.jsonValue?.value,
        id: '8',
      },
    ]?.filter((value) => value && value?.imgUrl?.trim() !== '');
  }, [
    ThumbnailImage1,
    ThumbnailImage2,
    ThumbnailImage3,
    ThumbnailImage4,
    ThumbnailImage5,
    ThumbnailImage6,
    ThumbnailImage7,
    ThumbnailImage8,
  ]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [accordionLeft, setAccordionLeft] = useState<number>(0);
  const [mainThumbnailImage, setMainThumbnailImage] = useState<ITypesThumbnailObj>(
    HideThumbnailImages?.jsonValue?.value === true
      ? {
          imgUrl: MainThumbnailImage?.jsonValue?.value ?? '',
          id: '1',
        }
      : thumbnailImgArr?.[0] ?? {
          imgUrl: thumbnailImgArr?.[0]?.imgUrl ?? '',
          id: thumbnailImgArr?.[0]?.id ?? '',
        }
  );
  const defaultValue = (children?.results?.[0]?.KitOptionTitle?.jsonValue?.value as string) || '';
  const [selectedKit, setSelectedKit] = useState<string>(defaultValue);
  const isHoverableCardStyles =
    'border-0 border-transparent hover:shadow-custom hover:p-3 hover:font-bold transition-all duration-60 ease-out hover:rounded-xl border-1 border-transparent hover:border-dark-gray hover:border-opacity-10 hover:font';

  const handleSelectDisplayImage = useCallback((imgString: string, id: string) => {
    setMainThumbnailImage({
      imgUrl: imgString ?? '',
      id: id ?? '',
    });
  }, []);

  const handleToggle = (event: React.MouseEvent) => {
    const article = event.currentTarget.closest('article');
    if (!article) return;

    const gridContainer = article.closest('.grid'); // Find the closest grid ancestor
    if (!gridContainer) return;

    const gridRect = gridContainer.getBoundingClientRect();
    const articleRect = article.getBoundingClientRect();

    const leftOffset = articleRect.left - gridRect.left;
    setAccordionLeft(leftOffset);

    const eventToggle = new CustomEvent('toggleAccordion', { detail: { uid } });
    window.dispatchEvent(eventToggle);
    setSelectedKit(defaultValue);
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const handleGlobalToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ uid: string | undefined }>;
      if (customEvent.detail.uid !== uid) {
        setIsExpanded(false); // Close this accordion if another one is opened
      }
    };

    window.addEventListener('toggleAccordion', handleGlobalToggle as EventListener);
    return () => {
      window.removeEventListener('toggleAccordion', handleGlobalToggle as EventListener);
    };
  }, [uid]);

  return (
    <>
      <article
        id={uid}
        className={cn(
          'relative flex flex-col h-fit p-3 rounded-md cursor-pointer group',
          !isMobile && !isTablet && isHoverableCardStyles
        )}
        tabIndex={0}
      >
        {mainThumbnailImage?.imgUrl && <ProductShowcaseImage imgVal={mainThumbnailImage?.imgUrl} />}
        <Text
          field={Heading?.jsonValue}
          tag={'p'}
          className="text-left font-bold lg:font-normal text-base mt-3 lg:mt-6 group-hover:font-bold"
        />
        <Text
          field={KitOptionText?.jsonValue}
          tag={'p'}
          className="text-left font-normal text-sm"
        />
        {HideThumbnailImages?.jsonValue?.value === false && thumbnailImgArr?.length > 1 && (
          <nav
            aria-label="Thumbnail navigation"
            className="hidden lg:flex gap-1 mt-6 overflow-x-auto h-full"
          >
            {thumbnailImgArr?.map((imgVal, index) => (
              <ProductsThumbnail
                key={index}
                id={imgVal?.id}
                index={index}
                imgVal={imgVal?.imgUrl}
                handleSelection={handleSelectDisplayImage}
                isSelected={mainThumbnailImage?.id === imgVal?.id}
              />
            ))}
          </nav>
        )}
        {HideSubMenu?.jsonValue?.value === false && (
          <Button
            size={SIZE?.MEDIUM}
            variant={ButtonVariant?.OUTLINE}
            className="mt-5"
            aria-expanded={isExpanded}
            aria-controls={`accordion-content-${uid}`}
            onClick={handleToggle}
          >
            {isExpanded ? (
              <FiMinus color="black" className="mr-1" />
            ) : (
              <FiPlus color="black" className="mr-1" />
            )}
            {isExpanded ? (
              <span className="font-medium text-xs">See less</span>
            ) : (
              <Text field={ButtonText?.jsonValue} tag={'span'} className="font-medium text-xs" />
            )}
          </Button>
        )}
      </article>
      {isExpanded && (
        <div className="relative lg:mt-17">
          <section
            id={`accordion-content-${uid}`}
            style={{
              visibility: isDesktop ? 'hidden' : 'visible',
              backgroundColor: BackgroundColor?.jsonValue?.value,
            }}
            className="mt-3 p-3 lg:w-dvw max-w-1280 transition-[max-height] duration-300 ease-in-out flex flex-col"
            role="region"
            aria-labelledby={`accordion-button-${uid}`}
          >
            <ProductEditorialDisplay
              title={ExtendedImageHeading}
              description={ExtendedImageDescription}
              editorialImages={editorialImages}
            />
            {/* <div className="hidden lg:flex h-515 mb-16 w-full overflow-hidden"></div> */}
            <hr className="border-t border-slate-300 mt-9 mb-6" />
            {/* <div className="flex lg:hidden w-full overflow-hidden"> */}
            <ProductKits
              selectedKit={selectedKit ?? ''}
              setSelectedKit={setSelectedKit}
              productsKits={children?.results}
              isHidden={isDesktop ? true : false}
            />
            {/* </div> */}

            <div className="hidden lg:flex h-515 mb-16 w-full overflow-hidden"></div>
            <div className="flex lg:hidden w-full overflow-hidden">
              <ProductCollectionCarousel
                SectionTitle={ExtendedProductCarouselTitle}
                ButtonFunctionality={ExtendedProductCarouselButtonFunctionality}
                DefaultItemsPerPageMobile={ExtendedProductCarouselDefaultItemsPerPageMobile}
                DefaultItemsPerPageDesktop={ExtendedProductCarouselDefaultItemsPerPageDesktop}
                DiscoverRfkId={ExtendedProductCarouselDiscoverRfkId}
                ButtonText={ExtendedProductCarouselButtonText}
              />
            </div>
          </section>
          <section
            id={`accordion-content-${uid}`}
            className="hidden lg:flex flex-col absolute top-0 left-0 w-screen max-w-1280 mt-1 p-3 transition-[max-height] duration-300 ease-in-out overflow-hidden"
            role="region"
            aria-labelledby={`accordion-button-${uid}`}
            style={{
              left: `-${accordionLeft}px`,
              backgroundColor: BackgroundColor?.jsonValue?.value,
            }} // Dynamically adjust left
          >
            <ProductEditorialDisplay
              title={ExtendedImageHeading}
              description={ExtendedImageDescription}
              editorialImages={editorialImages}
            />
            <div className="flex items-center w-full justify-center">
              <hr className="w-full border-t border-slate-300 mt-9 mb-6 max-w-992" />
            </div>

            <ProductKits
              productsKits={children?.results}
              isHidden={isDesktop ? false : true}
              selectedKit={selectedKit ?? ''}
              setSelectedKit={setSelectedKit}
            />
            <ProductCollectionCarousel
              SectionTitle={ExtendedProductCarouselTitle}
              ButtonFunctionality={ExtendedProductCarouselButtonFunctionality}
              DefaultItemsPerPageMobile={ExtendedProductCarouselDefaultItemsPerPageMobile}
              DefaultItemsPerPageDesktop={ExtendedProductCarouselDefaultItemsPerPageDesktop}
              DiscoverRfkId={ExtendedProductCarouselDiscoverRfkId}
              ButtonText={ExtendedProductCarouselButtonText}
            />
          </section>
        </div>
      )}
    </>
  );
};

export default memo(ProductCard);

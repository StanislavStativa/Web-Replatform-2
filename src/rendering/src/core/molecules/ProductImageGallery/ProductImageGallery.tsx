import React, { useRef, useState, useEffect } from 'react';
import { type ProductImageGallery } from './ProductImageGallery.type';
import ProductImageRightCarousel from './ProductImageRightCarousel';
import ProductImageLeftCarousel from './ProductImageLeftCarousel';
import CarouselView from './CarouselView';
import PDPMainTitle from '../ProductAttributes/PDPMainTitle';
import { useAtom } from 'jotai';
import { productStore } from '@/data/atoms/productStore';
import { Splide } from '@splidejs/react-splide';
import { useI18n } from 'next-localization';
import ProductImageRightCarouselSkeleton from './ProductImageRightCarouselSkeleton';
import ProductImageLeftCarouselSkeleton from './ProductImageLeftCarouselSkeleton';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import router from 'next/router';
declare global {
  interface Window {
    rfk: [
      {
        uri?: string;
        type: string;
        name: string;
        value: {
          context?: {
            user?: {
              id?: string;
              email?: string;
              fbid?: string;
              eid?: string;
            };
            page?: {
              uri: string;
            };
          };
          rfkid?: string;
          f?: string;
          click_type?: string;
          click_text?: string;
          products?: {
            sku: string;
            quantity?: number;
            price?: number;
            price_original?: number;
          }[];
          checkout?: {
            order_id?: string;
            subtotal?: number;
            total?: number;
            tax?: number;
            shipping_cost?: number;
          };
        };
      },
    ];
  }
}
const ProductImageGallery = () => {
  const [activeSlick, setActiveSlick] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const thumbnailRef = useRef<Splide>(null);
  const mainRef = useRef<Splide>(null);
  const [productImageGallery, setProductImageGallery] = useState<ProductImageGallery | null>(null);
  const [, setFormState] = useAtom(productStore);
  const { t } = useI18n();
  const [isMainImageDragged, setisMainImageDragged] = useState<boolean>(false);
  const context = useSitecoreContext();
  const data = context.sitecoreContext?.productData as ProductImageGallery;

  let scrollPosition = 0;

  useEffect(() => {
    if (data) {
      setProductImageGallery(data);
      if (typeof window !== 'undefined' && 'rfk' in window) {
        window.rfk.push({
          uri: router.asPath,
          value: {
            products: [
              {
                sku: data.ProductCode.replace(/^0{1,}/, ''),
              },
            ],
          },
          type: 'view',
          name: 'pdp',
        });
      }
    }
  }, [data]);

  const openModal = () => {
    scrollPosition = window.scrollY;
    setIsModalOpen(true);
    setFormState({
      isModal: true,
    });
    window.scrollTo(0, 0);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden'; // Hide the scrollbar
    document.body.classList.add('pdp-image-modal-open');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState({
      isModal: false,
    });
    // Restore body scroll and position
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.classList.remove('pdp-image-modal-open');
    // Restore the scroll position
    window.scrollTo(0, scrollPosition);
  };
  let colorCode = {
    color: '',
    text: '',
  };
  if (productImageGallery?.IsClearance) {
    colorCode = {
      color: 'bg-badge-red text-white',
      text: t('Tag_Clearance'),
    };
  } else if (productImageGallery?.IsNewArrival) {
    colorCode = {
      color: 'bg-dark-gray text-white',
      text: t('Tag_NewArrival'),
    };
  } else if (productImageGallery?.IsBestSeller) {
    colorCode = {
      color: 'bg-tonal-gray text-dark-gray',
      text: t('Tag_BestSeller'),
    };
  }
  return (
    <>
      <div className="w-full h-full">
        <div className="block md:hidden">
          {colorCode.color && (
            <div className="mt-6">
              <span
                className={`inline-block ${colorCode.color} text-sm font-latoBold uppercase py-1.5 px-3  rounded-full tracking-custom`}
              >
                {colorCode?.text}
              </span>
            </div>
          )}
          <PDPMainTitle
            ProductName={data?.ProductName}
            ProductCode={data?.ProductCode}
            CoveragePerBox={data?.CoveragePerBox}
            SellingUOM={data?.SellingUOM}
          />
        </div>
        <>
          {productImageGallery ? (
            <>
              <div className="flex flex-col-reverse lg:gap-8 items-center lg:flex-row w-full sticky left-0 right-0 top-0 lg:pb-9">
                <ProductImageRightCarousel
                  data={productImageGallery ?? []}
                  setActiveSlick={setActiveSlick}
                  activeSlick={activeSlick}
                  thumbnailRef={thumbnailRef}
                  mainRef={mainRef}
                  className="w-full h-full"
                  isMainImageDragged={isMainImageDragged}
                  setisMainImageDragged={setisMainImageDragged}
                />
                <div className="w-full flex justify-center mb-4.5 h-full min-h-96 md:min-h-112">
                  <ProductImageLeftCarousel
                    data={productImageGallery ?? []}
                    setActiveSlick={setActiveSlick}
                    activeSlick={activeSlick}
                    openModal={openModal}
                    mainRef={mainRef}
                    thumbnailRef={thumbnailRef}
                    className="w-full h-full"
                    isMainImageDragged={isMainImageDragged}
                    setisMainImageDragged={setisMainImageDragged}
                  />
                </div>
              </div>
              {isModalOpen && (
                <CarouselView
                  closeModal={closeModal}
                  setActiveSlick={setActiveSlick}
                  activeSlick={activeSlick}
                  mainRef={mainRef}
                  data={productImageGallery ?? []}
                  className="w-full h-full"
                  setisMainImageDragged={setisMainImageDragged}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full">
              <div className="flex flex-col-reverse lg:gap-8 items-center lg:flex-row w-full sticky left-0 right-0 top-0 lg:pb-9">
                <ProductImageRightCarouselSkeleton />
                <div className="w-full flex justify-center mb-4.5 h-full">
                  <ProductImageLeftCarouselSkeleton />
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default ProductImageGallery;

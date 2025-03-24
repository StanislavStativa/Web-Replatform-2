import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { Splide } from '@splidejs/react-splide';

export interface ProductImageGalleryProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}
export interface CarouselViewProps {
  data: ProductImageGallery;
  closeModal?: () => void;
  openModal?: () => void;
  setActiveSlick: (index: number) => void;
  activeSlick?: number;
  modalSettings?: {
    arrows: boolean;
    speed: number;
    vertical: boolean;
    infinite: boolean;
    slidesToShow: number;
    slidesToScroll: number;
    initialSlide: number;
    afterChange: (currentSlide: number) => void;
  };
  carouselStyle?: boolean;
  className?: string;
  visibleArrow?: boolean;
  mainRef?: React.RefObject<Splide>;
  thumbnailRef?: React.RefObject<Splide>;
  isMainImageDragged?: boolean;
  setisMainImageDragged: (drag: boolean) => void;
}

export interface ProductImageGallery {
  ProductName: string;
  ProductCode: string;
  ProductDescription: string;
  CoveragePerBox: number;
  ImageGalleryAssets: ImageGalleryAsset[];
  IsClearance: boolean;
  IsBestSeller: boolean;
  IsNewArrival: boolean;
  SellingUOM: string;
  StockType: string;
  ImageLink: string;
  ProductNotAvailableDescText: string;
}

export interface ImageGalleryAsset {
  path: string;
  name: string;
  type: string;
  url: string;
  altText: string;
  ThumbnailAltText: string;
}

export interface PDPMainTitleProps {
  ProductName: string;
  ProductCode: string;
  CoveragePerBox: number;
  SellingUOM: string;
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { type CarouselViewProps } from './ProductImageGallery.type';
import { cn } from '@/utils/cn';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Splide as SplideType } from '@splidejs/splide'; // Import Splide type
import InnerImageZoom from 'react-inner-image-zoom';
import '@splidejs/react-splide/css';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaPlay } from 'react-icons/fa';
import { Image } from '@unpic/react';
interface ArrowProps {
  onClick: () => void;
  disabled?: boolean;
}

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick, disabled }) => (
  <button
    className={`hidden lg:block absolute right-1.2m md:right-2.5m top-55p transform -translate-y-1/2 z-10 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
    onClick={!disabled ? onClick : undefined}
    style={{ background: 'none', border: 'none' }}
    disabled={disabled}
  >
    <IoIosArrowForward style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick, disabled }) => (
  <button
    className={`hidden lg:block absolute left-1.2m md:left-2.5m top-55p transform -translate-y-1/2 z-10 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
    onClick={!disabled ? onClick : undefined}
    style={{ background: 'none', border: 'none' }}
    disabled={disabled}
  >
    <IoIosArrowBack style={{ color: 'black', fontSize: '25px', fontWeight: '700' }} />
  </button>
);

const MainCustomNextArrow: React.FC<ArrowProps> = ({ onClick, disabled }) => (
  <button
    className={`hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-6 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
    onClick={!disabled ? onClick : undefined}
    style={{ background: 'none', border: 'none' }}
    disabled={disabled}
  >
    <Image src="/assets/gallery-arrow-right.svg" alt="prev" width={36} height={36} />
  </button>
);

const MainCustomPrevArrow: React.FC<ArrowProps> = ({ onClick, disabled }) => (
  <button
    className={`hidden md:block absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-6  ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
    onClick={!disabled ? onClick : undefined}
    style={{ background: 'none', border: 'none' }}
    disabled={disabled}
  >
    <Image src="/assets/gallery-arrow-left.svg" alt="next" width={36} height={36} />
  </button>
);

const CarouselView: React.FC<CarouselViewProps> = (props) => {
  const { data, closeModal, activeSlick = 0 } = props;
  const mainRefer = useRef<Splide>(null); // Use the correct Splide type
  const thumbsRef = useRef<Splide>(null); // Use the correct Splide type
  const [carouselDimensions, setCarouselDimensions] = useState<{
    fixedWidth: number;
    fixedHeight: number;
  }>({ fixedWidth: 54, fixedHeight: 54 });
  const [carouselPerPage, setCarouselPerPage] = useState<number>(10);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentactiveSlickIndex, setCurrentActiveSlickIndex] = useState(0);
  const [imageType, setImageType] = useState('image');
  const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  const handleThumbnailClick = (index: number, imagetype: string) => {
    setCurrentActiveSlickIndex(index);
    setCurrentIndex(index);
    setImageType(imagetype);
    if (currentactiveSlickIndex !== index) {
      if (mainRefer?.current) {
        mainRefer.current.go(index);
      } else {
        console.warn('mainRefer.current is null on click');
      }
    }
    setIsVideoPlayed(false);
  };

  const handlePrevClick = () => {
    if (mainRefer.current) {
      const newIndex = Math.max(currentactiveSlickIndex - 1, 0);
      mainRefer.current.go(newIndex);
      thumbsRef?.current?.go(newIndex);
      setCurrentActiveSlickIndex(newIndex);
      setCurrentIndex(newIndex);
    }
  };

  const handleNextClick = () => {
    if (mainRefer.current) {
      const newIndex = Math.min(currentactiveSlickIndex + 1, data?.ImageGalleryAssets.length - 1);
      mainRefer.current.go(newIndex);
      thumbsRef?.current?.go(newIndex);
      setCurrentActiveSlickIndex(newIndex);
      setCurrentIndex(newIndex);
    }
  };

  const handleThumbNextClick = () => {
    if (thumbsRef.current) {
      const newIndex = Math.min(currentactiveSlickIndex + 1, data?.ImageGalleryAssets.length - 10);
      thumbsRef.current.go(newIndex);
      setCurrentIndex(newIndex);
    }
  };

  const handleThumbPrevClick = () => {
    if (thumbsRef.current) {
      const newIndex = Math.max(currentactiveSlickIndex - 1, 0);
      thumbsRef.current.go(newIndex);
      setCurrentIndex(newIndex);
    }
  };
  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;

    let fixedWidth = 56;
    let fixedHeight = 56;
    const screenHeight = window.innerHeight;
    if (headerRef.current && footerRef.current && captionRef.current) {
      const topHeight = headerRef.current.offsetHeight;
      const bottomHeight = footerRef.current.offsetHeight;
      const captionHeight = captionRef.current.offsetHeight;
      const totalHeight = topHeight + bottomHeight + captionHeight + 10;
      const maxHeight = screenHeight - totalHeight;
      setHeights(maxHeight);
    }
    setCarouselPerPage(4);
    if (width >= 1024) {
      fixedWidth = 56;
      fixedHeight = 56;
      setCarouselPerPage(10);
    } else if (width <= 1024 && width >= 820) {
      fixedWidth = 74;
      fixedHeight = 74;
    } else if (width <= 820 && width >= 768) {
      fixedWidth = 135;
      fixedHeight = 135;
    } else if (width <= 768 && width >= 712) {
      window.scrollTo(0, 0);
      fixedWidth = 136;
      fixedHeight = 136;
    } else if (width <= 712 && width >= 480) {
      window.scrollTo(0, 0);
      fixedWidth = 156;
      fixedHeight = 156;
    } else if (width <= 480 && width >= 425) {
      window.scrollTo(0, 0);
      fixedWidth = 98;
      fixedHeight = 98;
    } else if (width <= 425 && width > 375) {
      window.scrollTo(0, 0);
      fixedWidth = 72;
      fixedHeight = 72;
    } else if (width <= 375 && width >= 360) {
      window.scrollTo(0, 0);
      fixedWidth = 68;
      fixedHeight = 68;
    } else {
      fixedWidth = 58;
      fixedHeight = 58;
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
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const playAEMVideo = (imageName: string) => {
    if (videoContainerRef.current) {
      const self = videoContainerRef.current;

      // Remove existing content
      self.innerHTML = '';
      const video = document.createElement('video');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('controls', 'true');
      video.setAttribute('controlsList', 'nodownload');
      video.setAttribute('style', 'width:100%');

      const source = document.createElement('source');
      source.setAttribute('src', `${process?.env?.NEXT_PUBLIC_CONTENT_URL}${imageName}`);
      source.setAttribute('type', 'video/mp4');
      source.innerText = 'Your browser does not support the video tag.';

      video.appendChild(source);
      self.appendChild(video);

      video.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
      setIsVideoPlayed(true);
      document.addEventListener('pdpSlidePauseVideo', () => video.pause());
      self.setAttribute('data-video-init', 'true');
    }
  };

  const handleSlideChange = (splide: SplideType) => {
    setCurrentActiveSlickIndex(splide?.index);
    thumbsRef?.current?.go(splide?.index);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRefer?.current?.go(activeSlick);
    thumbsRef?.current?.go(activeSlick);
    setCurrentActiveSlickIndex(activeSlick);
    setCurrentIndex(activeSlick);
  }, []);
  return (
    <div aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div
        className="fixed z-[99999999] h-svh w-full inset-0 bg-white transition-opacity"
        aria-hidden="true"
      >
        <div className="relative bg-white flex flex-col h-svh carousel-modal">
          <div
            ref={headerRef}
            className="px-5 py-5 md:py-30 md:h-88 md:px-10 border-b border-tonal-gray w-full header-section"
          >
            <h3 className="text-lg mr-12 leading-normal text-dark-gray font-latoBold">
              {data?.ProductName}
            </h3>
            <button
              className="absolute top-6 right-5 p-2 bg-none border-none cursor-pointer z-10"
              onClick={closeModal}
            >
              <Image src="/assets/close-modal.svg" alt="Close Modal" width={18} height={18} />
            </button>
          </div>
          <div className="flex-1 relative flex-grow items-center justify-center">
            <div
              className={`flex-1 px-5 pt-5 pb-9 md:pb-5 md:pt-0 relative flex-grow items-center justify-center w-full mx-auto ${imageType !== 'Video' ? 'hover-max-w-full' : ''}`}
              style={{
                maxWidth: isVideoPlayed ? '100%' : `${heights}px`,
                maxHeight: `${heights}px`,
              }}
            >
              <Splide
                options={{
                  type: 'fade',
                  perPage: 1,
                  pagination: false,
                  arrows: false,
                  cover: true,
                  autoplay: false,
                  initialSlide: currentactiveSlickIndex,
                  drag: true,
                }}
                ref={mainRefer as React.RefObject<Splide>}
                onMove={handleSlideChange}
              >
                {data?.ImageGalleryAssets.map((image, index) => (
                  <SplideSlide key={index} style={{ maxHeight: `${heights}px` }}>
                    {image.type?.toLowerCase() === 'video' && currentactiveSlickIndex === index ? (
                      <div
                        ref={videoContainerRef}
                        id={`pdp-modal-video-${index}`}
                        data-video-init="false"
                        className="aem-video relative"
                        data-video-name={image.name}
                        onClick={() => playAEMVideo(image?.name)}
                        style={{ maxHeight: `${heights}px`, width: '100%' }}
                      >
                        <img
                          src={`${image?.url}?$PDPNormal$&fmt=webp`}
                          data-src={`${image.url}?$PDPNormal$&fmt=webp`}
                          data-pin-no-hover="true"
                          alt={image.name}
                        />
                        <span className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white bg-opacity-50 border-none rounded-full w-12 h-12 cursor-pointer">
                          <FaPlay className="text-gray w-6 h-6" />
                        </span>
                      </div>
                    ) : (
                      <>
                        <InnerImageZoom
                          zoomType="hover"
                          hideCloseButton={true}
                          hideHint={true}
                          zoomPreload={true}
                          src={`${image?.url}?$PDPLarge$&fmt=webp`}
                          zoomSrc={`${image?.url}?$PDPLarge$&fmt=webp`}
                        />
                        <div ref={captionRef} className="pdp-caption-modal-carousel"></div>
                      </>
                    )}
                  </SplideSlide>
                ))}
              </Splide>
            </div>
            {data?.ImageGalleryAssets.length > 1 && (
              <>
                <MainCustomPrevArrow
                  onClick={handlePrevClick}
                  disabled={currentactiveSlickIndex === 0}
                />
                <MainCustomNextArrow
                  onClick={handleNextClick}
                  disabled={currentactiveSlickIndex === data?.ImageGalleryAssets.length - 1}
                />
              </>
            )}
          </div>
          <div
            ref={footerRef}
            className="w-full relative border-t border-tonal-gray pt-2.5 md:pt-5 px-5 md:px-90 pb-5 md:pb-7.5"
          >
            <div
              className={`lg:max-w-740 relative mx-auto footer-carousel ${data?.ImageGalleryAssets.length >= 10 ? '' : 'show-arrow'}`}
            >
              <Splide
                options={{
                  perPage: carouselPerPage,
                  fixedWidth: carouselDimensions.fixedWidth,
                  fixedHeight: carouselDimensions.fixedHeight,
                  isNavigation: false,
                  gap: 20,
                  pagination: true,
                  cover: false,
                  arrows: false,
                  type: 'slide',
                  initialSlide: currentactiveSlickIndex,
                  autoplay: false,
                  width: 'auto',
                }}
                ref={thumbsRef}
              >
                {data?.ImageGalleryAssets?.map((image, index) => (
                  <SplideSlide
                    key={index}
                    className={cn('cursor-pointer w-full')}
                    onClick={() => handleThumbnailClick(index, image.type)}
                  >
                    <div className="p-0.5">
                      {image.type?.toLowerCase() === 'video' ? (
                        <div className="relative cursor-pointer">
                          <img
                            src={`${image?.url}?$PDPThumbnail$&fmt=webp`}
                            alt="slider"
                            className={cn(
                              'border border-light-border-gray focus:outline-none cursor-pointer',
                              index === currentactiveSlickIndex ? 'border-search-gray' : ''
                            )}
                          />
                          <span className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white bg-opacity-50 border-none rounded-full w-12 h-12 cursor-pointer ">
                            <FaPlay className="text-gray w-6 h-6" />
                          </span>
                        </div>
                      ) : (
                        <img
                          src={`${image?.url}?$PDPThumbnail$&fmt=webp`}
                          alt="slider"
                          className={cn(
                            'border border-light-border-gray focus:outline-none cursor-pointer',
                            index === currentactiveSlickIndex ? 'border-search-gray' : ''
                          )}
                        />
                      )}
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
              {data?.ImageGalleryAssets.length > 10 && (
                <CustomPrevArrow onClick={handleThumbPrevClick} disabled={currentIndex === 0} />
              )}
              {data?.ImageGalleryAssets.length > 10 && (
                <CustomNextArrow
                  onClick={handleThumbNextClick}
                  disabled={currentIndex >= data?.ImageGalleryAssets.length - 10}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselView;

import React, { useEffect, useRef, useState } from 'react';
import { type CarouselViewProps } from './ProductImageGallery.type';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { Splide as SplideType } from '@splidejs/splide'; // Import Splide type
import { FaPlay } from 'react-icons/fa';

const ProductImageLeftCarousel: React.FC<CarouselViewProps> = (props) => {
  const {
    data,
    setActiveSlick,
    activeSlick = 0,
    openModal,
    mainRef,
    thumbnailRef,
    setisMainImageDragged,
  } = props;
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [showPinterest, setshowPinterest] = useState<boolean>(true);

  const handleSlideChange = (splide: SplideType) => {
    const newIndex = splide.index;
    setActiveSlick(newIndex); // Directly set the new index
    if (setisMainImageDragged) {
      setisMainImageDragged(true);
    }
  };

  useEffect(() => {
    if (mainRef?.current && thumbnailRef?.current && mainRef.current.splide) {
      setActiveSlick(mainRef.current.splide?.index);
      thumbnailRef?.current.sync(mainRef.current.splide);
    }
  }, [mainRef, thumbnailRef]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            const element = node as HTMLElement;
            if (element.nodeType === 1 && element.matches('span[data-pin-href]')) {
              element.style.display = showPinterest ? '' : 'none';
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [showPinterest]);

  const playAEMVideo = (imageName: string) => {
    if (videoContainerRef.current) {
      const self = videoContainerRef.current;
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

      document.addEventListener('pdpSlidePauseVideo', () => video.pause());
      self.setAttribute('data-video-init', 'true');
    }
  };

  return (
    <div className="w-full lg:w-[525px] h-full flex items-center justify-between">
      <Splide
        options={{
          type: 'fade',
          perPage: 1,
          pagination: false,
          arrows: false,
          cover: true,
          drag: true,
          sync: thumbnailRef?.current,
        }}
        ref={mainRef as React.RefObject<Splide>}
        onMove={handleSlideChange}
      >
        {data?.ImageGalleryAssets?.map((image, index) => (
          <SplideSlide
            key={index}
            onClick={image.type?.toLowerCase() !== 'video' ? openModal : undefined}
          >
            {image.type?.toLowerCase() === 'video' && activeSlick === index ? (
              <div
                ref={videoContainerRef}
                id={`pdp-modal-video-${index}`}
                data-video-init="false"
                className="aem-video relative"
                data-video-name={image.name}
                onClick={() => playAEMVideo(image?.name)}
                key={index}
              >
                <img
                  src={`${image?.url}?$PDPNormal$&fmt=webp`}
                  data-src={`${image.url}?$PDPNormal$&fmt=webp`}
                  data-pin-no-hover={true}
                  alt={image.name}
                />
                <span className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white bg-opacity-50 border-none rounded-full w-12 h-12 cursor-pointer">
                  <FaPlay className="text-gray w-6 h-6" />
                </span>
              </div>
            ) : (
              <InnerImageZoom
                zoomType="hover"
                hideCloseButton={true}
                hideHint={true}
                zoomPreload={true}
                src={`${image?.url}?$PDPNormal$&fmt=webp`}
                zoomSrc={`${image?.url}?$PDPNormal$&fmt=webp`}
                afterZoomIn={() => setshowPinterest(false)}
                afterZoomOut={() => setshowPinterest(true)}
              />
            )}
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default ProductImageLeftCarousel;

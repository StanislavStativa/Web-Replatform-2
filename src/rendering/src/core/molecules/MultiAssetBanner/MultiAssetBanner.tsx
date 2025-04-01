import { MultiAssetBannerProps } from './MultiAssetBanner.types';
import { useState, useRef } from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '../../atoms/Image/Image';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import Tile from './MultiAssetTile';
import useImageFormat from '@/hooks/useImageFormat';

const MultiAssetBanner = (props: MultiAssetBannerProps): JSX.Element | null => {
  const { fields } = props?.rendering;
  const { HeadingTag } = props?.params;
  const tiles = props?.rendering?.fields?.Tiles || [];
  const {
    Title,
    Description,
    Image: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  } = props?.rendering?.fields;
  const [currentTileIndex, setCurrentTileIndex] = useState(0);
  const tilesContainerRef = useRef<HTMLDivElement>(null);

  const { desktopImage, tabletImage, mobileImage } = useImageFormat({
    BannerImage: DesktopImage,
    ImageSmartCropFormat,
    MobileImage,
    TabletImage,
  });

  const handleNextClick = () => {
    if (currentTileIndex < fields.Tiles.length - 1) {
      const newIndex = currentTileIndex + 1;
      setCurrentTileIndex(newIndex);
      if (tilesContainerRef.current) {
        const tileWidth = tilesContainerRef.current.querySelector('.tile')?.clientWidth || 0;
        tilesContainerRef.current.scrollLeft += tileWidth;
      }
    }
  };

  const handlePrevClick = () => {
    if (currentTileIndex > 0) {
      const newIndex = currentTileIndex - 1;
      setCurrentTileIndex(newIndex);
      if (tilesContainerRef.current) {
        const tileWidth = tilesContainerRef.current.querySelector('.tile')?.clientWidth || 0;
        tilesContainerRef.current.scrollLeft -= tileWidth;
      }
    }
  };
  if (tiles.length === 0) {
    return null;
  }

  return (
    <div
      className={`multi-asset-banner container mx-auto rounded-2xl shadow-md ${props?.params?.styles} flex`}
    >
      <div className="left-column hidden md:block w-2/5">
        <Image
          className="rounded-tl-2xl rounded-bl-2xl h-full object-cover"
          desktopSrc={desktopImage?.url}
          tabletSrc={tabletImage?.url}
          mobileSrc={mobileImage?.url}
          hidePinterest={true}
        />
      </div>
      <div className="right-column w-3/5 flex-1 p-4">
        <div className="p-4">
          {Title?.value !== '' && <Text className="mb-4" tag={HeadingTag || 'h2'} field={Title} />}
          {Description?.value !== '' && (
            <RichText className="mb-5 hidden md:block" field={Description} />
          )}
        </div>
        <div className="px-4 relative">
          {fields.Tiles && fields.Tiles.length > 0 && (
            <div className="scroller flex items-center">
              {currentTileIndex > 0 && (
                <button
                  className="carousel-arrow left hidden md:block bg-none border-none text-xl cursor-pointer absolute -left-1 top-[20%]"
                  onClick={handlePrevClick}
                >
                  <GrFormPrevious />
                </button>
              )}
              <div
                ref={tilesContainerRef}
                className="tiles-container relative flex overflow-x-auto whitespace-nowrap  gap-4"
              >
                {tiles.map((tile, index) => (
                  <div
                    key={index}
                    className="tile inline-block flex-shrink-0  cursor-pointer pb-4"
                    onClick={() => (window.location.href = tile?.fields?.CTA?.value?.href || '')}
                  >
                    <Tile {...tile.fields} />
                  </div>
                ))}
              </div>

              {currentTileIndex < fields.Tiles.length - 4 && (
                <button
                  className="carousel-arrow hidden md:block right bg-none border-none text-xl cursor-pointer absolute -right-1 top-[20%]"
                  onClick={handleNextClick}
                >
                  <MdNavigateNext />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiAssetBanner;

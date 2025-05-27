import React, { memo } from 'react';
import { getAdobeImageURL } from '@/core/atoms/Image/URLBuilder';
import Image from '@/core/atoms/Image/Image';
import { cn } from '@/utils/cn';
export type ITypesProductsThumbnail = {
  index: number;
  imgVal: string;
  id: string;
  handleSelection: (imgString: string, id: string) => void;
  isSelected: boolean;
};
const ProductsThumbnail = ({
  index,
  imgVal,
  handleSelection,
  id,
  isSelected,
}: ITypesProductsThumbnail) => {
  const imageUrl = getAdobeImageURL({
    imageName: imgVal ?? '',
  });
  return (
    <button
      key={index}
      id={id}
      aria-label={`Select image ${index + 1}`}
      className={cn('rounded-md w-8 h-8 p-[1px]', {
        border: isSelected,
      })}
      onClick={() => handleSelection(imgVal, id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSelection(imgVal, id);
        }
      }}
      tabIndex={0}
    >
      <Image
        alt={imageUrl?.altText}
        desktopSrc={imageUrl?.url}
        className="w-full h-full object-fill cursor-pointer hover:opacity-75 transition rounded-md"
      />
    </button>
  );
};

export default memo(ProductsThumbnail);

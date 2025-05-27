// components/ProductImageLeftCarouselSkeleton.js
import React from 'react';

const ProductImageLeftCarouselSkeleton = () => {
  return (
    <div className="w-full lg:w-[525px] h-full flex items-center justify-between">
      <div className={`w-full h-full`}>
        <div className={`skeleton w-full h-96 md-72 lg:h-[525px] `}></div>
      </div>
    </div>
  );
};

export default ProductImageLeftCarouselSkeleton;

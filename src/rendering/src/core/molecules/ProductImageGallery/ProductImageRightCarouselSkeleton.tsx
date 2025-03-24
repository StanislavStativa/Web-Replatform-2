// components/ProductImageRightCarouselSkeleton.js
import React from 'react';

const ProductImageRightCarouselSkeleton = () => {
  return (
    <div className="w-full mt-5 lg:mt-5 lg:w-25 md:mb-10 right-carousel">
      <div className="flex flex-row lg:flex-col items-center justify-center mb-5 md:mt-7 lg:mb-0 lg:mt-0">
        <div className={`flex flex-row lg:flex-col items-center justify-center  w-full h-full`}>
          <div className={`skeleton circle`}></div>
          <div className={`skeleton w-12 h-12 mx-1 lg:w-24 lg:h-24 lg:mx-0`}></div>
          <div className={`skeleton w-12 h-12 mx-1 lg:w-24 lg:h-24 lg:mx-0`}></div>
          <div className={`skeleton w-12 h-12 mx-1 lg:w-24 lg:h-24 lg:mx-0`}></div>
          <div className={`skeleton w-12 h-12 mx-1 lg:w-24 lg:h-24 lg:mx-0`}></div>
          <div className={`skeleton circle`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageRightCarouselSkeleton;

import { memo } from 'react';

import { ITypesReviewItemDetail } from '../OrderReview.type';

const ReviewItemDetail = ({ title, content }: ITypesReviewItemDetail) => {
  return (
    <div className="flex flex-col items-start gap-1 md:gap-2 lg:py-2">
      <div className="flex gap-2">
        <p className="text-xs text-dark-gray font-medium  md:w-37 leading-3">{title}</p>
      </div>
      <p className="text-base text-dark-gray font-latoBold md:w-109 leading-6">{content}</p>
    </div>
  );
};

export default memo(ReviewItemDetail);

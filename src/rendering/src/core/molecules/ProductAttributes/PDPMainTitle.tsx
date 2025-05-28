import React from 'react';
import { type PDPMainTitleProps } from '../ProductImageGallery/ProductImageGallery.type';
import { useI18n } from 'next-localization';

const PDPMainTitle: React.FC<PDPMainTitleProps> = ({
  ProductName,
  ProductCode,
  CoveragePerBox,
  SellingUOM,
}) => {
  const { t } = useI18n();
  const coverageDictonaryValue = t('PDPAttributes_CoveragePerBox');
  const coverageText =
    SellingUOM && SellingUOM !== 'EA'
      ? typeof CoveragePerBox === 'number' && !isNaN(CoveragePerBox)
        ? coverageDictonaryValue.replace(/(\{.*?\})/g, `${CoveragePerBox.toFixed(2)}`)
        : '' // Fallback if CoveragePerBox is not a number
      : '';
  return (
    <div>
      <div className="flex flex-col items-start gap-1.5 py-1.5 pb-6 pt-6 md:pt-0">
        <h1 className="font-latoBold md:font-latoRegular text-xl mt-2.5 mb-2.5 md:text-32-s leading-6 md:leading-9 text-dark-gray">
          {ProductName}
        </h1>
        <p className="flex items-center gap-1 md:gap-6 md:uppercase text-13-s font-normal font-latoRegular md:font-latoBold  mb-3.5 md:mb-0 tracking-wider text-dark-gray md:text-pdp-grey-text">
          <span>#{ProductCode}</span>
          {CoveragePerBox > 0 && <span>{coverageText}</span>}
        </p>
      </div>
    </div>
  );
};

export default PDPMainTitle;

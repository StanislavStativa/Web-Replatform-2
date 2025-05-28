import { useI18n } from 'next-localization';
import { type ProductAttributesProps } from './ProductAttributes.types';
import Cookies from 'js-cookie';
import { IS_PROUSER } from '@/config';
import { useEffect, useState } from 'react';

const PDPPriceDetail: React.FC<ProductAttributesProps> = (data) => {
  const { t } = useI18n();
  const priceBreak = data?.data?.PriceSchedule?.PriceBreaks[0];
  const initialPrice = priceBreak?.Price;
  const salePrice = priceBreak?.SalePrice;
  const percentOff =
    initialPrice && salePrice && initialPrice > 0 ? 1 - salePrice / initialPrice : 0;
  const [isProUser, setIsProUser] = useState<boolean>(false);

  useEffect(() => {
    const proUserCookie = Cookies.get(IS_PROUSER);
    if (proUserCookie !== undefined) setIsProUser(proUserCookie === 'true');
  }, [data, isProUser]);
  return (
    <div className="flex flex-col justify-center items-start gap-3">
      <div className="text-dark-gray text-base font-normal">
        {percentOff > 0 && (
          <div className="mb-2 inline-block bg-badge-red text-white text-sm font-latoBold uppercase py-1 px-4 rounded-full">
            {`${(percentOff * 100)?.toFixed(0)}% OFF`}
          </div>
        )}
        <div className="price-container flex flex-col sm:flex-row sm:items-center sm:gap-4">
          {data?.data?.PriceSchedule?.PriceBreaks.map((breakItem, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              {breakItem?.Price > breakItem?.SalePrice && (
                <span className="text-drak-gray mb-0 text-2xl font-latoBold text-decoration-line: line-through">
                  ${breakItem?.Price?.toFixed(2)}{' '}
                  {data?.data?.SellingUOM === 'EA' ? t('PDPAttributes_Each') : t('OrderReview_Box')}
                </span>
              )}
              {breakItem?.SalePrice > 0 && (
                <span className="text-dark-gray mb-0 text-2xl font-latoBold">
                  ${breakItem.SalePrice?.toFixed(2)}
                  {data?.data?.SellingUOM === 'EA' ? t('PDPAttributes_Each') : t('OrderReview_Box')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="price-container flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <>
          {data?.data?.PriceSchedule?.xp?.Price > data?.data?.PriceSchedule?.xp?.SalePrice && (
            <span className="text-xl font-latoRegular leading-8 text-dark-gray text-decoration-line: line-through">
              ${data?.data?.PriceSchedule?.xp?.Price?.toFixed(2)?.toString()}/
              {t('PDPCalculator_SqFt')}
            </span>
          )}
          {data?.data?.PriceSchedule?.xp?.SalePrice > 0 && (
            <span className="text-xl font-latoRegular leading-8 text-dark-gray">
              ${data?.data?.PriceSchedule?.xp?.SalePrice?.toFixed(2)?.toString()}/
              {t('PDPCalculator_SqFt')}
            </span>
          )}
        </>
      </div>
      {!(
        (data?.data?.IsOnlinePurchasableRetail === true && !isProUser) ||
        (data?.data?.IsOnlinePurchasablePro === true && isProUser)
      ) && <div>{data?.data?.ProductNotAvailableDescText}</div>}
    </div>
  );
};

export default PDPPriceDetail;

import clsx from 'clsx';
import { type CardItemPriceProps, PRODUCT_TYPE } from './CartItemCard.types';
import { useI18n } from 'next-localization';
import Cookies from 'js-cookie';
import { IS_PROUSER } from '@/config';

const CardItemPrice: React.FC<CardItemPriceProps> = ({
  ActualPrice,
  DiscountPrice,
  PromotionDiscountText,
  SellingText,
  type,
  PromotionDiscount,
}) => {
  const { t } = useI18n();
  const isProUser = Cookies.get(IS_PROUSER);
  return (
    <div className="flex flex-col items-start gap-2 lg:py-2">
      <div className="flex gap-2">
        {ActualPrice > 0 && PromotionDiscount > 0 ? (
          <p className="text-xs text-dark-gray font-medium line-through w-37 leading-3">
            ${ActualPrice?.toFixed(2)}
          </p>
        ) : null}
        {type === PRODUCT_TYPE.SAMPLE &&
        PromotionDiscountText?.length > 0 &&
        PromotionDiscount > 0 ? (
          <p className="flex lg:hidden text-xs font-medium text-red-500 leading-4">
            {PromotionDiscountText}
          </p>
        ) : null}
      </div>
      {DiscountPrice > 0 && type === PRODUCT_TYPE.ITEM ? (
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
          ${DiscountPrice?.toFixed(2)}/{SellingText}
        </p>
      ) : null}
      {DiscountPrice > 0 &&
      (isProUser === undefined || isProUser === 'false') &&
      type === PRODUCT_TYPE.SAMPLE ? (
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
          ${DiscountPrice?.toFixed(2)}/
          {type === PRODUCT_TYPE.SAMPLE ? t('Cart_Sample').toLowerCase() : SellingText}
        </p>
      ) : null}
      {isProUser && isProUser === 'true' && type === PRODUCT_TYPE.SAMPLE ? (
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
          ${DiscountPrice?.toFixed(2)}/
          {type === PRODUCT_TYPE.SAMPLE ? t('Cart_Sample').toLowerCase() : SellingText}
        </p>
      ) : null}
      {PromotionDiscountText?.length > 0 && PromotionDiscount > 0 ? (
        <p
          className={clsx('text-xs font-medium text-red-500 leading-4', {
            'hidden lg:flex': type === PRODUCT_TYPE.SAMPLE,
          })}
        >
          {PromotionDiscountText}
        </p>
      ) : null}
    </div>
  );
};
export default CardItemPrice;

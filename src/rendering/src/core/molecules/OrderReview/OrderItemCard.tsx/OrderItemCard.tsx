import { useI18n } from 'next-localization';

import Image from '@/core/atoms/Image/Image';

import ReviewItemDetail from './ReviewItemDetail';
import { memo } from 'react';
import { ITypesOrderItemCard } from '../OrderReview.type';

const OrderItemCard = ({
  productSku,
  itemName,
  quantity,

  unitPrice,
  totalPrice,
  imageUrl,
  isSample,
  quantityUnit,
}: ITypesOrderItemCard) => {
  const { t } = useI18n();
  const updateProductUrl = imageUrl?.replace(/SS/g, '');
  const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${updateProductUrl}?$PDPThumbnail$`;
  return (
    <section
      id="orderReviewItems"
      className="flex items-start justify-between w-full flex-col md:flex-row"
    >
      <div className="flex items-start gap-3.5 lg:max-w-52p">
        <div className="flex flex-col gap-3 min-w-139">
          <Image
            desktopSrc={productImage}
            mobileSrc={productImage}
            className="bg-tonal-gray rounded-lg w-135 h-135 border-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-medium text-dark-gray">#{productSku}</p>

          <p className="text-base text-dark-gray font-latoBold w-auto md:w-158">{itemName}</p>
          <div className="flex md:hidden flex-col">
            <ReviewItemDetail
              title={t('OrderReview_Price')}
              content={
                isSample
                  ? `$${unitPrice?.toFixed(2)}/${t('Order_Sample').toLocaleLowerCase()}`
                  : `$${unitPrice?.toFixed(2)}${quantityUnit !== 'EA' ? t('OrderReview_Box').toLocaleLowerCase() : t('PDPAttributes_Each').toLocaleLowerCase()}`
              }
            />
            <div className="flex gap-3.5 flex-row">
              <ReviewItemDetail
                title={t('OrderReview_Quantity')}
                content={
                  isSample
                    ? `${quantity} ${quantity > 1 ? t('Order_Samples') : t('Order_Sample')}`
                    : quantityUnit !== 'EA'
                      ? `${quantity} ${quantity > 1 ? t('OrderReview_Boxes') : t('Order_Box')}`
                      : `${quantity} ${t('Cart_Each')}`
                }
              />
              <ReviewItemDetail
                title={t('OrderReview_Total')}
                content={`$${totalPrice?.toFixed(2)}`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:flex py-2 gap-12 items-start w-full md:w-1/2 hidden md:block ">
        <ReviewItemDetail
          title={t('OrderReview_Price')}
          content={
            isSample
              ? `$${unitPrice?.toFixed(2)}/${t('Order_Sample').toLocaleLowerCase()}`
              : `$${unitPrice?.toFixed(2)}${quantityUnit !== 'EA' ? t('OrderReview_Box').toLocaleLowerCase() : t('PDPAttributes_Each').toLocaleLowerCase()}`
          }
        />
        <ReviewItemDetail
          title={t('OrderReview_Quantity')}
          content={
            isSample
              ? `${quantity} ${quantity > 1 ? t('Order_Samples') : t('Order_Sample')}`
              : quantityUnit !== 'EA'
                ? `${quantity} ${quantity > 1 ? t('OrderReview_Boxes') : t('Order_Box')}`
                : `${quantity} ${t('Cart_Each')}`
          }
        />
        <ReviewItemDetail title={t('OrderReview_Total')} content={`$${totalPrice?.toFixed(2)}`} />
      </div>
    </section>
  );
};

export default memo(OrderItemCard);

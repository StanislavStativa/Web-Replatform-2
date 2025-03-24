import React, { memo } from 'react';
import { useI18n } from 'next-localization';
import { ITypesOrderInvoiceSummary } from './OrderReview.type';
const OrderInvoiceSummary = ({
  shippingCharge,
  subTotal,
  tax,
  orderTotal,
  discount,
}: ITypesOrderInvoiceSummary) => {
  const { t } = useI18n();

  return (
    <div className="w-full flex flex-col gap-6 pb-5">
      <div className="w-full flex flex-row items-center justify-between">
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
          {t('OrderReview_SubTotal')}
        </p>
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6 text-right">{`$${subTotal?.toFixed(2)}`}</p>
      </div>
      {discount && discount > 0 ? (
        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
            {t('Order_Discount')}
          </p>
          <p className="text-base text-light-slate-red font-latoBold w-109 leading-6 text-right">{`-$${discount.toFixed(2)}`}</p>
        </div>
      ) : null}

      <div className="w-full flex flex-row items-center justify-between">
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
          {t('Order_Shipping')}
        </p>
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6 text-right">{`$${shippingCharge?.toFixed(2)}`}</p>
      </div>
      <div className="w-full flex flex-row items-center justify-between">
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6">
          {t('OrderReview_Tax')}
        </p>
        <p className="text-base text-dark-gray font-latoBold w-109 leading-6 text-right">{`$${tax?.toFixed(2)}`}</p>
      </div>
      <hr className="border-t border-dark-gray w-full opacity-30" />
      <div className="w-full flex flex-row items-center justify-between">
        <p className="e text-dark-gray text-xl font-semibold w-109 leading-6">
          {t('OrderReview_OrderTotal')}
        </p>
        <p className="text-xl text-dark-gray font-semibold w-109 leading-6 text-right">{`$${orderTotal?.toFixed(2)}`}</p>
      </div>
    </div>
  );
};

export default memo(OrderInvoiceSummary);

import React, { useEffect, useState } from 'react';

import OrderItemCard from './OrderItemCard.tsx/OrderItemCard';
import { useI18n } from 'next-localization';
import OrderInvoiceSummary from './OrderInvoiceSummary';
import OrderShippingInfo from './OrderShippingInfo';
import { ITypesLineItems, ITypesOrderReviewSummary } from './OrderReview.type';
const Summary = ({
  lineItems,
  shippingCharge,
  subTotal,
  tax,
  orderTotal,
  isShowOrder,
  shipAddress,
  discount,
}: ITypesOrderReviewSummary) => {
  const { t } = useI18n();

  const [sampleItems, setSampleItems] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (lineItems && lineItems?.length > 0 && isShowOrder === false) {
      const getSamples = lineItems?.filter(
        (item: { IsSampleProduct: boolean }) => item?.IsSampleProduct === true
      );

      const getItems = lineItems?.filter(
        (item: { IsSampleProduct: boolean }) => item?.IsSampleProduct === false
      );
      setSampleItems(getSamples);
      setItems(getItems);
    }
  }, [lineItems]);

  if (!lineItems) {
    return null;
  }
  return (
    <>
      {lineItems && lineItems?.length > 0 && isShowOrder === true ? (
        <>
          <div className="flex flex-col gap-2.5 py-4 px-3.7 lg:px-9.5 border border-gray rounded-xl">
            <div className="flex flex-col items-start gap-6">
              <div className="flex items-start gap-4 lg:gap-8.5 flex-col lg:flex-row">
                <div className="flex flex-col gap-2">
                  <h4 className="text-2xl leading-7 font-normal text-dark-gray flex gap-1">
                    {t('Order_OrderSummary')}
                  </h4>
                </div>
              </div>
              {lineItems
                ?.sort((a: ITypesLineItems, b: ITypesLineItems) => {
                  // Sort so that IsSampleProduct true items come first
                  return (
                    (b?.IsSampleProduct === true ? 1 : 0) - (a?.IsSampleProduct === true ? 1 : 0)
                  );
                })
                ?.map((item: ITypesLineItems) => {
                  return (
                    <OrderItemCard
                      key={item?.ProductSKU}
                      productSku={item?.ProductSKU}
                      itemName={item?.ItemName}
                      quantity={item?.Quantity}
                      quantityUnit={item?.QuantityUnit}
                      unitPrice={item?.UnitPrice}
                      totalPrice={item?.TotalPrice}
                      imageUrl={item?.ImageUrl}
                      isSample={item?.IsSampleProduct}
                    />
                  );
                })}
              {isShowOrder && (
                <>
                  <hr className="border-t border-dark-gray w-full opacity-30" />
                  <OrderInvoiceSummary
                    shippingCharge={shippingCharge}
                    subTotal={subTotal}
                    tax={tax}
                    orderTotal={orderTotal}
                    discount={discount}
                  />
                </>
              )}
            </div>
          </div>
          <OrderShippingInfo shipAddress={shipAddress} />
        </>
      ) : null}

      <>
        {isShowOrder === false && (
          <div className="flex w-full flex-col gap-9">
            {sampleItems?.length > 0 && (
              <>
                <div className="flex flex-col gap-2.5 py-4 px-3.7 lg:px-9.5 border border-gray rounded-xl">
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-start gap-4 lg:gap-8.5 flex-col lg:flex-row">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-2xl leading-7 font-normal text-dark-gray flex gap-1">
                          {t('Cart_Samples')}
                        </h4>
                      </div>
                    </div>
                    {sampleItems?.map((item: ITypesLineItems) => {
                      return (
                        <OrderItemCard
                          key={item?.ProductSKU}
                          productSku={item?.ProductSKU}
                          itemName={item?.ItemName}
                          quantity={item?.Quantity}
                          quantityUnit={item?.QuantityUnit}
                          unitPrice={item?.UnitPrice}
                          totalPrice={item?.TotalPrice}
                          imageUrl={item?.ImageUrl}
                          isSample={true}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            {items?.length > 0 && (
              <>
                <div className="flex flex-col gap-2.5 py-4 px-3.7 lg:px-9.5 border border-gray rounded-xl">
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-start gap-4 lg:gap-8.5 flex-col lg:flex-row">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-2xl leading-7 font-normal text-dark-gray flex gap-1">
                          {t('Cart_Items')}
                        </h4>
                      </div>
                    </div>
                    {items?.map((item: ITypesLineItems) => {
                      return (
                        <OrderItemCard
                          key={item?.ProductSKU}
                          productSku={item?.ProductSKU}
                          itemName={item?.ItemName}
                          quantity={item?.Quantity}
                          quantityUnit={item?.QuantityUnit}
                          unitPrice={item?.UnitPrice}
                          totalPrice={item?.TotalPrice}
                          imageUrl={item?.ImageUrl}
                          isSample={false}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <OrderShippingInfo shipAddress={shipAddress} />
          </div>
        )}
      </>
    </>
  );
};

export default Summary;

import React, { useEffect, useState, useRef } from 'react';
import { ITypesOrderReview } from './OrderReview.type';
import Heading from './Heading';
import Summary from './Summary';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderSummaryService } from '@/api/services/OrderSummaryService';
import useLocalStorage from '@/utils/useLocalStorage';
import { useReactToPrint } from 'react-to-print';
import Link from '@/core/atoms/Link/Link';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { useAtom } from 'jotai';
import { cartSubmitError } from '../Modal/atom';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import Cookies from 'js-cookie';
import { SITE_ID } from '@/config';
import { paymentSelectedOption } from '@/data/atoms/paymentSelectedOption';
import { triggerEvent } from '@/utils/eventTracking';
import { event } from '@/config';

type EventOrderSummary = {
  items: {
    discount: number;
    item_brand: string;
    item_category: string;
    item_category2: string;
    item_category3: string;
    item_category4: string;
    item_category5: string;
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }[];
  currency: string;
  value: number;
  tax: number;
  shipping: number;
  payment_type: string;
  transaction_id?: string;
};
interface Product {
  TotalPrice: number;
  UnitPrice: number;
  PromotionDiscount: number;
  ProductSKU: string;
  ItemName: string;
  Brand: string;
  ProductHierarchy1Name: string;
  ProductHierarchy2Name: string;
  MaterialGroup: string;
  CollectionName: string;
  Quantity: number;
  shipping_tier: string;
}

const OrderReview = (props: ITypesOrderReview) => {
  const { Title, SecondaryCTA, CTA, Description } = props?.rendering?.fields;
  const queryClient = useQueryClient();
  const { uid } = props?.rendering;
  const { getData } = useLocalStorage();
  const contentToPrint = useRef<HTMLDivElement>(null);

  const isShowOrder = Boolean(props?.rendering?.params?.ShowOrderTotal);
  const [orderId, setOrderId] = useState<string | null>(null);
  const stashedOrderId = getData<string>('oderId');
  const [isCartSubmitError, setCartSubmitError] = useAtom(cartSubmitError);
  const { data: orderReviewDetails } = useQuery({
    queryKey: ['getOrderReviewDetails', orderId],
    queryFn: () => {
      return OrderSummaryService.orderSummaryGetOrderDetails(orderId as string);
    },
    enabled: Boolean(orderId !== null),
  });
  const [orderReviewItem, setEventOrderReview] = useState<EventOrderSummary | null>(null);
  const [PaymentSelectedType] = useAtom(paymentSelectedOption);
  const handlePrint = useReactToPrint({
    removeAfterPrint: true,
  });
  useEffect(() => {
    if (stashedOrderId) {
      setOrderId(stashedOrderId);
    } else {
      setOrderId(null);
    }
  }, [stashedOrderId]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isCartSubmitError) {
      timeoutId = setTimeout(() => {
        setCartSubmitError(false);
      }, 10000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [isCartSubmitError]);

  useEffect(() => {
    if (orderReviewDetails) {
      if (
        orderReviewDetails.SiteId &&
        orderReviewDetails.SiteId !== '' &&
        orderReviewDetails.SiteId !== undefined
      ) {
        Cookies.set(SITE_ID, orderReviewDetails.SiteId);
      }
      queryClient.invalidateQueries({ queryKey: ['cartGetCartListItems'] });
      const cardItems =
        orderReviewDetails?.LineItems?.map((product: Product) => {
          const price = Number(product?.UnitPrice?.toFixed(2));
          return {
            discount: product?.PromotionDiscount || 0,
            item_brand: product?.Brand || '',
            item_category: product?.ProductHierarchy1Name || '',
            item_category2: product?.ProductHierarchy2Name || '',
            item_category3: product?.MaterialGroup || '',
            item_category4: product?.CollectionName || '',
            item_category5: '',
            item_id: product?.ProductSKU || '',
            item_name: product?.ItemName || '',
            price: price,
            quantity: product?.Quantity,
          };
        }) || [];
      const eventData = {
        items: cardItems,
        currency: 'USD',
        value: Number(orderReviewDetails?.OrderTotal?.toFixed(2)),
        tax: Number(orderReviewDetails?.Tax?.toFixed(2)),
        shipping: Number(orderReviewDetails?.Shipping?.toFixed(2)),
        payment_type: PaymentSelectedType as string,
        transaction_id: orderReviewDetails?.OrderNumber,
      };
      setEventOrderReview(eventData);
    }
  }, [orderReviewDetails]);

  useEffect(() => {
    if (orderReviewItem) {
      if (isShowOrder) {
        const purchasedItem =
          orderReviewItem?.items?.map((product) => {
            return {
              item: product?.item_id,
              price: product?.price,
              quantity: product?.quantity,
            };
          }) || [];
        setTimeout(() => {
          window?.ScarabQueue?.push(['setEmail', orderReviewDetails?.UserEmail]);
          window?.ScarabQueue.push(['cart', []]);
          window?.ScarabQueue.push([
            'purchase',
            {
              orderId: orderReviewItem?.transaction_id,
              items: purchasedItem,
            },
          ]);
          window?.ScarabQueue.push(['go']);
        }, 1000);
        triggerEvent({
          event: event?.PURCHASE,
          ecommerce: {
            currency: orderReviewItem?.currency,
            value: orderReviewItem?.value,
            tax: orderReviewItem?.tax,
            shipping: orderReviewItem?.shipping,
            transaction_id: orderReviewItem?.transaction_id,
            items: orderReviewItem?.items,
          },
        });
      } else if (isShowOrder === false) {
        triggerEvent({
          event: event?.ADD_PAYMENT_INFO,
          ecommerce: {
            payment_type: orderReviewItem?.payment_type,
            currency: orderReviewItem?.currency,
            value: orderReviewItem?.value,
            tax: orderReviewItem?.tax,
            items: orderReviewItem?.items,
          },
        });
      }

      if (isShowOrder) {
        if (typeof window !== 'undefined' && 'rfk' in window) {
          window.rfk.push({
            type: 'order',
            name: 'confirm',
            value: {
              context: {
                user: {
                  email: orderReviewDetails?.UserEmail,
                  fbid: '',
                  eid: orderReviewDetails?.UserEmail,
                },
              },
              products: [
                orderReviewDetails?.LineItems?.map((product: Product) => {
                  return {
                    sku: product?.ProductSKU,
                    quantity: product?.Quantity,
                    price: Number(product?.UnitPrice),
                    price_original: Number(product?.TotalPrice),
                  };
                }),
              ],
              checkout: {
                total: orderReviewDetails?.OrderTotal?.toFixed(2),
                order_id: orderReviewDetails?.OrderNumber,
                subtotal: orderReviewDetails?.SubTotal?.toFixed(2),
                tax: orderReviewDetails?.Tax?.toFixed(2),
                shipping_cost: orderReviewDetails?.Shipping?.toFixed(2),
              },
            },
          });
        }
      }
    }
  }, [orderReviewItem]);

  return (
    <>
      {isShowOrder && (
        <Link
          className="text-black justify-start px-5 md:px-0 max-w-max"
          variant={LinkVariant.INLINE}
          href={CTA?.value?.href}
          field={CTA}
        >{`< ${CTA.value.title}`}</Link>
      )}
      <section
        key={uid}
        ref={contentToPrint}
        className={`flex flex-col gap-6 pt-5   md:p-0 px-5 md:pt-10 ${isShowOrder ? 'col-span-full' : 'col-span-4'}`}
      >
        {isCartSubmitError && (
          <NotificationMessage isCloseable onCancel={() => setCartSubmitError(false)} />
        )}
        {orderReviewDetails && (
          <>
            <Heading
              Title={Title}
              orderNumber={orderReviewDetails?.OrderNumber}
              userEmail={orderReviewDetails?.UserEmail}
              isShowOrder={isShowOrder}
              onPrint={handlePrint}
              contentToPrint={contentToPrint}
              SecondaryCTA={SecondaryCTA}
              Description={Description}
            />
            <Summary
              lineItems={orderReviewDetails?.LineItems}
              shippingCharge={orderReviewDetails?.Shipping}
              subTotal={orderReviewDetails?.SubTotal}
              tax={orderReviewDetails?.Tax}
              orderTotal={orderReviewDetails?.OrderTotal}
              isShowOrder={isShowOrder}
              shipAddress={orderReviewDetails?.ShippingAddresses}
              discount={orderReviewDetails?.PromotionDiscount}
            />
          </>
        )}
      </section>
    </>
  );
};

export default OrderReview;

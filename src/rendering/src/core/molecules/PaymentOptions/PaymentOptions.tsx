import React, { useEffect, useState } from 'react';
import { PaymentOptionsProps } from './PaymentOptions.types';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from '@/core/atoms/Image/Image';
import { useI18n } from 'next-localization';
import { paymentSelectedOption, paymentSelectedType } from '@/data/atoms/paymentSelectedOption';
import { useAtom } from 'jotai';
import { PAYMENTFILTER, PAYMENTOPTIONS, PROTERMSOFPAYMENT } from '@/utils/constants';
import Cookies from 'js-cookie';
import { IS_NET_PRO, IS_PROUSER } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { CartService } from '@/api/services/CartService';
import { creditCardError } from '@/data/atoms/creditCardEnteredData';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { useShipTo } from '@/hooks/useShipTo';
import { useShipStore } from '@/store/useShipStore';
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
  shipping_tier: string;
};
interface Product {
  UnitPrice: number;
  PromotionDiscount: number;
  ProductID: string;
  Product: {
    xp: {
      Brand: string;
      ProductHierarchy1Name: string;
      ProductHierarchy2Name: string;
      MaterialGroup: string;
      CollectionName: string;
    };
    Name: string;
  };
  xp: {
    PromotionDiscount: number;
  };
  Quantity: number;
  shipping_tier: string;
}

const PaymentOptions = (props: PaymentOptionsProps) => {
  const {
    Title,
    CardImage,
    DiscoverImage,
    MastercardImage,
    VisaImage,
    InvoiceImage,
    ProUsers,
    PersonalUsers,
  } = props?.rendering?.fields;
  const { isOnlySamples } = useShipTo();
  const [isCreditCardServiceSelected, setIsCreditCardServiceSelected] = useState(false);
  const [isInvoiceSelected, setIsInvoiceSelected] = useState(false);
  const [, setPaymentSelectedOptionData] = useAtom(paymentSelectedOption);
  const [, setPaymentType] = useAtom(paymentSelectedType);
  const { t } = useI18n();
  const proUserCheck = Cookies.get(IS_PROUSER);
  const ntProUser = Cookies.get(IS_NET_PRO);
  const [isCreditCardError, setIsCreditError] = useAtom(creditCardError);
  const [isProUser, setIsProUser] = useState<boolean | null>(null);
  const [isNtProUser, setIsNtProUser] = useState<boolean | null>(null);
  const { selectedShipCTa } = useShipStore();
  const [orderPaymentItem, setEventOrderPayment] = useState<EventOrderSummary | null>(null);

  const proTermsArray = [
    PROTERMSOFPAYMENT.NETTHIRTY,
    PROTERMSOFPAYMENT.NETFOURTYFIVE,
    PROTERMSOFPAYMENT.NETNINENTY,
    PROTERMSOFPAYMENT.NETZERO,
  ];
  const handlePaymentOptionSelected = (name: string) => {
    if (name === PAYMENTOPTIONS.CREDITCARD) {
      const paymentTypeId = PersonalUsers.filter(
        (item) => item.displayName === PAYMENTFILTER.CREDITCARDS
      );
      setPaymentSelectedOptionData(PAYMENTOPTIONS.CREDITCARD);
      setIsCreditCardServiceSelected(true);
      setIsInvoiceSelected(false);
      setPaymentType(paymentTypeId?.[0]?.fields?.ID?.value);
    } else if (name === PAYMENTOPTIONS.INVOICE) {
      const paymentTypeId = ProUsers.filter((item) => item.displayName === PAYMENTFILTER.INVOICE);

      setPaymentSelectedOptionData(PAYMENTOPTIONS.INVOICE);
      setPaymentType(paymentTypeId?.[0]?.fields?.ID?.value);
      setIsCreditCardServiceSelected(false);
      setIsInvoiceSelected(true);
    }
  };
  const { data: fetchTotalSum } = useQuery({
    queryKey: ['getTotalSum'],
    queryFn: () => {
      return CartService.cartGetOrderSummary();
    },
  });

  useEffect(() => {
    if (ntProUser && Object.values(proTermsArray).includes(ntProUser.trim() as PROTERMSOFPAYMENT)) {
      setIsNtProUser(true);
    } else {
      setIsNtProUser(false);
    }
  }, [ntProUser]);
  useEffect(() => {
    if (orderPaymentItem === null && fetchTotalSum) {
      const cardItems =
        fetchTotalSum?.LineItems?.map((product: Product) => {
          const price = Number(product?.UnitPrice?.toFixed(2));
          return {
            discount: Number(product?.xp?.PromotionDiscount) || 0,
            item_brand: product?.Product?.xp?.Brand || '',
            item_category: product?.Product?.xp?.ProductHierarchy1Name || '',
            item_category2: product?.Product?.xp?.ProductHierarchy2Name || '',
            item_category3: product?.Product?.xp?.MaterialGroup || '',
            item_category4: product?.Product?.xp?.CollectionName || '',
            item_category5: '',
            item_id: product?.ProductID || '',
            item_name: product?.Product?.Name || '',
            price: price,
            quantity: product?.Quantity || 0,
          };
        }) || [];
      const eventData = {
        items: cardItems,
        currency: 'USD',
        value: Number(fetchTotalSum?.Order?.Total?.toFixed(2)) || 0.0,
        tax: Number(fetchTotalSum?.Order?.TaxCost?.toFixed(2)) || 0.0,
        shipping: Number(fetchTotalSum?.Order?.ShippingCost?.toFixed(2)) || 0.0,
        shipping_tier: selectedShipCTa.selectedCta || '',
      };
      setEventOrderPayment(eventData);
    }
  }, [fetchTotalSum, orderPaymentItem]);

  useEffect(() => {
    if (proUserCheck) {
      setIsProUser(true);
    } else {
      setIsProUser(false);
    }
  }, [proUserCheck]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isCreditCardError?.isError) {
      timeoutId = setTimeout(() => {
        setIsCreditError({
          isError: false,
          errorMessage: '',
        });
      }, 8000); // 1 min
    }

    return () => clearTimeout(timeoutId);
  }, [isCreditCardError?.isError, setIsCreditError]);

  useEffect(() => {
    if (isOnlySamples && isProUser === true) {
      handlePaymentOptionSelected('Invoice');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnlySamples, isProUser]);

  useEffect(() => {
    if (orderPaymentItem) {
      triggerEvent({
        event: event?.ADD_SHIPPING_INFO,
        ecommerce: {
          currency: orderPaymentItem?.currency,
          value: orderPaymentItem?.value,
          tax: orderPaymentItem?.tax,
          shipping: orderPaymentItem?.shipping,
          items: orderPaymentItem?.items,
        },
      });
    }
  }, [orderPaymentItem]);

  if (isOnlySamples && isProUser === true) {
    return null;
  }
  return (
    <div className="md:pt-10 px-5 md:px-0 pb-6">
      {isCreditCardError?.isError && (
        <NotificationMessage
          message={isCreditCardError.errorMessage}
          isCloseable
          onCancel={() =>
            setIsCreditError({
              isError: false,
              errorMessage: '',
            })
          }
        />
      )}
      <h3 className="text-dark-gray text-3xl mb-6">{t('Payment_PaymentTitle')}</h3>
      <div
        className={`rounded-xl w-full grid grid-cols-10 gap-x-3 border border-border-gray bg-white py-6 px-4 md:px-10 `}
      >
        <div className="col-span-full md:col-span-6">
          <div className="flex flex-col gap-y-4">
            <Text field={Title} tag="h4" className="text-2xl text-dark-gray" />

            <div
              className={`flex items-center gap-x-4 border cursor-pointer min-h-16 ${isCreditCardServiceSelected ? 'outline outline-2 outline-black shadow-custom' : 'border-black '} rounded-xl p-3`}
              onClick={() => {
                handlePaymentOptionSelected('Credit_Card');
              }}
            >
              <Image
                className="object-contain"
                field={{
                  value: {
                    src: VisaImage?.value?.src,
                    width: Number(VisaImage?.value?.width),
                    height: Number(VisaImage?.value?.height),
                    alt: VisaImage?.value?.alt,
                  },
                }}
              />
              <p>{t('Payment_CreditCard')}</p>
              <div className="flex gap-x-2">
                <Image
                  className="object-contain"
                  field={{
                    value: {
                      src: CardImage?.value?.src,
                      width: Number(CardImage?.value?.width),
                      height: Number(CardImage?.value?.height),
                      alt: CardImage?.value?.alt,
                    },
                  }}
                />
                <Image
                  className="object-contain"
                  field={{
                    value: {
                      src: DiscoverImage?.value?.src,
                      width: Number(DiscoverImage?.value?.width),
                      height: Number(DiscoverImage?.value?.height),
                      alt: DiscoverImage?.value?.alt,
                    },
                  }}
                />
                <Image
                  className="object-contain"
                  field={{
                    value: {
                      src: MastercardImage?.value?.src,
                      width: Number(MastercardImage?.value?.width),
                      height: Number(MastercardImage?.value?.height),
                      alt: MastercardImage?.value?.alt,
                    },
                  }}
                />
              </div>
            </div>

            {isProUser === true && isNtProUser === true && (
              <div
                className={`flex items-center gap-x-4 border cursor-pointer min-h-16 ${isInvoiceSelected ? 'outline outline-2 outline-black shadow-custom' : 'border-black '} rounded-xl p-3`}
                onClick={() => {
                  handlePaymentOptionSelected('Invoice');
                }}
              >
                <Image
                  className="object-contain"
                  field={{
                    value: {
                      src: InvoiceImage?.value?.src,
                      width: Number(InvoiceImage?.value?.width),
                      height: Number(InvoiceImage?.value?.height),
                      alt: InvoiceImage?.value?.alt,
                    },
                  }}
                />
                <p className="font-bold">Invoice</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-4 flex items-end"></div>
      </div>
    </div>
  );
};

export default PaymentOptions;

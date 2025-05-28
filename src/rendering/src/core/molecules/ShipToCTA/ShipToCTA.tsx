import Image from '@/core/atoms/Image/Image';
import Link from '@/core/atoms/Link/Link';
import { useI18n } from 'next-localization';
import { ShipToCTAProps } from './ShipToCTA.types';
import { useShipStore, ITypesShipToCta } from '@/store/useShipStore';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useShipTo } from '@/hooks/useShipTo';
import { useEffect, useState } from 'react';
import { useOrderSummary } from '@/hooks/useOrderSummary';
import { useMutation } from '@tanstack/react-query';
import { CartService } from '@/api/services/CartService';
import { useAtom } from 'jotai';
import { cartShippingAddresData } from '@/data/atoms/cartShippingAddresData';
import { IFullAddressType } from '../StoresPickup/StoresPickup.types';
import { storePickupSelectedData } from '@/data/atoms/storePickupSelectedData';
import { ADDNEWADDRESS, COUNTRYNAMES } from '@/utils/constants';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { shippingError } from '@/core/cartStore/cartState';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
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
}

const ShipToCTA = (props: ShipToCTAProps) => {
  const { Caution, PickupStore, ShippAddress, ShippAddressHover, PickupStoreHover } =
    props?.rendering?.fields;
  const { t } = useI18n();
  const { selectedShipCTa, handleSetSelectedShipCta } = useShipStore();
  const { fetchedCartData, refetchCartData } = useOrderSummary();
  const { isOnlySamples, isOnlyItems, sampleAndItem } = useShipTo();
  const [isShippedHovered, setIsShippedHovered] = useState(false);
  const [isPickupHovered, setIsPickupHovered] = useState(false);
  const [customerAddressFormData] = useAtom(cartShippingAddresData);
  const [storePickupFormData] = useAtom<IFullAddressType>(storePickupSelectedData);
  const [isShippingError, setShippingError] = useAtom(shippingError);
  const isAddNewAddress = customerAddressFormData?.savedAddress === ADDNEWADDRESS;
  const [orderSummaryItem, setEventOrderSummary] = useState<EventOrderSummary | null>(null);
  const [isCheckoutTriggered, setIsCheckoutTriggered] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await CartService.cartUpdateWecoPartnerShippingAddress({
        customerAddress: isAddNewAddress
          ? {
              company: customerAddressFormData?.companyName,
              address: customerAddressFormData?.addressLine1,
              address2: customerAddressFormData?.addressLine2,
              city: customerAddressFormData?.city,
              state: customerAddressFormData?.state,
              zipCode: customerAddressFormData?.zipCode,
              isDefault: customerAddressFormData?.rememberMe,
              shipping: true,
              shippingInstructions: customerAddressFormData?.shippingInstructions,
            }
          : {
              id:
                isOnlyItems && selectedShipCTa.selectedCta === 'pick'
                  ? ''
                  : customerAddressFormData?.savedAddress,
            },
        partialClientStoreInfo: {
          sapStoreId: storePickupFormData?.sapStoreId,
          storeId: storePickupFormData?.storeId,
          storeName: storePickupFormData?.StoreName,
          address1: storePickupFormData?.AddressLine1,

          city: storePickupFormData?.City,
          state: storePickupFormData?.StateCode,
          country: COUNTRYNAMES.US,
          postalCode: storePickupFormData?.PostalCode,
        },
        /*
isStorePickup case
1:- User can toggle b/w two ctas and only one need to be selected if "isOnlyItems" is true
and selected is ship to new then pass false otherwise as per storeId presence
2:- if only samples then no field for pickup default false
3:- if both sample and item then if user is not selecting pickup then it will be false
*/
        isStorePickup:
          isOnlyItems && selectedShipCTa.selectedCta === 'ship'
            ? false
            : isOnlySamples
              ? false
              : sampleAndItem && selectedShipCTa.selectedCta !== 'pick'
                ? false
                : Boolean(storePickupFormData?.storeId),
        // Todo
      });
    },
    onSuccess: () => {
      refetchCartData();
    },
    onError: () => {},
  });

  const handleShipType = (ctaType: ITypesShipToCta['selectedCta']) => {
    if (selectedShipCTa.selectedCta === ctaType) {
      return;
    } else {
      handleSetSelectedShipCta({ selectedCta: ctaType });
      mutate();
    }
  };

  useEffect(() => {
    if (
      fetchedCartData?.Order?.xp?.DeliveryType &&
      fetchedCartData?.Order?.xp?.DeliveryType !== undefined
    ) {
      handleSetSelectedShipCta({
        selectedCta:
          fetchedCartData?.Order?.xp?.DeliveryType === 991
            ? 'ship'
            : fetchedCartData?.Order?.xp?.DeliveryType === 990
              ? 'pick'
              : null,
      });
    } else {
      handleSetSelectedShipCta({
        selectedCta: null,
      });
    }
    if (fetchedCartData) {
      const cardItems =
        fetchedCartData?.LineItems?.map((product: Product) => {
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
        value: Number(fetchedCartData?.Order?.Total?.toFixed(2)) || 0.0,
        tax: Number(fetchedCartData?.Order?.TaxCost?.toFixed(2)) || 0.0,
        shipping: Number(fetchedCartData?.Order?.ShippingCost?.toFixed(2)) || 0.0,
      };
      setEventOrderSummary(eventData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedCartData?.Order?.xp?.DeliveryType]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isShippingError) {
      timeoutId = setTimeout(() => {
        setShippingError(null);
      }, 20000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShippingError]);

  useEffect(() => {
    if (orderSummaryItem && !isCheckoutTriggered) {
      triggerEvent({
        event: event?.BEGIN_CHECKOUT,
        ecommerce: {
          currency: orderSummaryItem?.currency,
          value: orderSummaryItem?.value,
          tax: orderSummaryItem?.tax,
          shipping: orderSummaryItem?.shipping,
          items: orderSummaryItem?.items,
        },
      });
      setIsCheckoutTriggered(true); // Prevent multiple triggers
    }
  }, [orderSummaryItem, isCheckoutTriggered]);

  return (
    <div className=" md:pt-10 px-5 lg:px-0">
      {isPending && <LoaderSpinner />}
      <h3 className="text-dark-gray text-3xl mb-6">{t('Order_Shipping')}</h3>
      {isShippingError && (
        <NotificationMessage
          message={isShippingError}
          isCloseable
          onCancel={() => setShippingError(null)}
        />
      )}
      <div
        className={`rounded-xl w-full grid grid-cols-10 gap-x-3 border border-border-gray bg-white py-6 px-4 md:px-10 ${isOnlySamples ? 'hidden' : ''} 
              md:grid-cols-10 flex flex-col gap-y-3`}
      >
        <div className="col-span-full md:col-span-6">
          <div className="flex flex-col gap-y-4">
            <h4 className="text-2xl text-dark-gray">{t('Cart_ShipTo')}</h4>
            <div className="flex flex-col gap-y-2.5">
              <Button
                variant={ButtonVariant?.OUTLINE}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                className={`w-full justify-start p-0 h-[70px] ${selectedShipCTa.selectedCta === 'pick' ? 'outline outline-2 outline-black shadow-custom' : ''}`}
                onClick={() => handleShipType('pick')}
                onMouseEnter={() => setIsShippedHovered(true)}
                onMouseLeave={() => setIsShippedHovered(false)}
              >
                <div className="flex gap-x-3 items-center pl-3">
                  {ShippAddress?.value?.src &&
                    !(isShippedHovered || selectedShipCTa.selectedCta === 'pick') && (
                      <Image
                        field={{
                          value: {
                            src: ShippAddress?.value?.src,
                            width: Number(ShippAddress?.value?.width || 50),
                            height: Number(ShippAddress?.value?.height || 50),
                            alt: ShippAddress?.value?.alt,
                          },
                        }}
                      />
                    )}
                  {ShippAddressHover?.value?.src &&
                    (isShippedHovered || selectedShipCTa.selectedCta === 'pick') && (
                      <Image
                        field={{
                          value: {
                            src: ShippAddressHover?.value?.src,
                            width: Number(ShippAddressHover?.value?.width || 50),
                            height: Number(ShippAddressHover?.value?.height || 50),
                            alt: ShippAddressHover?.value?.alt,
                          },
                        }}
                      />
                    )}
                  <div>
                    <p
                      className={`${selectedShipCTa.selectedCta === 'pick' ? 'font-latoBold text-black' : ''}`}
                    >
                      {t('Cart_PickupInStore')}
                    </p>
                  </div>
                </div>
              </Button>
              <Button
                variant={ButtonVariant?.OUTLINE}
                isCTATextInCaps={props?.params?.IsCTATextInCaps}
                onClick={() => handleShipType('ship')}
                className={`w-full justify-start p-0 h-[70px]  ${selectedShipCTa.selectedCta === 'ship' ? 'outline outline-2 outline-black shadow-custom' : ''}`}
                onMouseEnter={() => setIsPickupHovered(true)}
                onMouseLeave={() => setIsPickupHovered(false)}
              >
                <div className="flex gap-x-3 items-center pl-3">
                  {PickupStore.value?.src &&
                    !(isPickupHovered || selectedShipCTa.selectedCta === 'ship') && (
                      <Image
                        field={{
                          value: {
                            src: PickupStore?.value?.src,
                            width: Number(PickupStore?.value?.width || 50),
                            height: Number(PickupStore?.value?.height || 50),
                            alt: PickupStore?.value?.alt,
                          },
                        }}
                      />
                    )}
                  {PickupStoreHover?.value?.src &&
                    (isPickupHovered || selectedShipCTa.selectedCta === 'ship') && (
                      <Image
                        field={{
                          value: {
                            src: PickupStoreHover?.value?.src,
                            width: Number(PickupStoreHover?.value?.width || 50),
                            height: Number(PickupStoreHover?.value?.height || 50),
                            alt: PickupStoreHover?.value?.alt,
                          },
                        }}
                      />
                    )}
                  <div>
                    <p
                      className={`${selectedShipCTa.selectedCta === 'ship' ? 'font-latoBold text-black' : ''}`}
                    >
                      {t('Cart_ShipToNeworSavedAddress')}
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-full grid-rows-2 md:grid-rows-1 md:col-span-4 flex items-end">
          <div className="py-3 px-9 md:px-2 lg:px-9  bg-tonal-gray rounded-md h-36">
            <div className="flex flex-col gap-y-2.5">
              <div className="flex justify-center">
                {Caution?.value?.src && (
                  <Image
                    field={{
                      value: {
                        src: Caution?.value?.src,
                        width: Number(Caution?.value?.width),
                        height: Number(Caution?.value?.height),
                        alt: Caution?.value?.alt,
                      },
                    }}
                  />
                )}
              </div>

              <p className="text-xs">
                {t('Cart_SampleDescription')}
                <span className="ml-1">
                  <Link
                    className="underline"
                    field={{ href: t('Cart_CTALearnMore') }}
                    editable={false}
                  >
                    {t('Cart_LearnMore')}
                  </Link>
                </span>
              </p>
              <div className="flex"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipToCTA;

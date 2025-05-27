import React, { useState, useEffect } from 'react';
import { useI18n } from 'next-localization';
import Button from '@/core/atoms/Button/Button';
import { IoIosUnlock } from 'react-icons/io';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { OrderSummaryGuestProps } from './OrderSummary.type';
import { useAtom } from 'jotai';
import cartAtom, { cartDetailAtom } from '@/core/cartStore/cartState';
import { useRouter } from 'next/router';
import useLocalStorage from '@/utils/useLocalStorage';
import { CartItem, CartItemDetails } from '@/core/cartStore/CartStoreType';

const OrderSummaryGuest = (props: OrderSummaryGuestProps) => {
  const router = useRouter();
  const { Title, isAuthenticated, SignInLink } = props;
  const { t } = useI18n();
  const { getData } = useLocalStorage();
  const [productGuestTotal, setProductGuestTotal] = useState(0);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [totalGuestDiscount, setTotalGuestDiscount] = useState(0);
  // const [fetchedGuestCart, setFetchedGuestCart] = useState<FetchedGuestCartDataProps | null>(null);
  const localData = getData<CartItem[]>('cartState');
  const [localCart] = useAtom(cartAtom);

  const handleDivertToLogin = () => {
    router.push(`${SignInLink?.value?.href}?returnurl=${router.asPath}`);
  };
  const isSampleNotReadyForDisplay = cartDetailState?.Samples?.CartItem?.some(
    (item) => item?.ReadyForDisplay === false
  );
  const isItemNotReadyForDisplay = cartDetailState?.CartItems?.CartItem?.some(
    (item) => item?.ReadyForDisplay === false
  );
  useEffect(() => {
    if (cartDetailState && localCart && localCart?.length > 0) {
      const productTotal =
        (cartDetailState?.Samples?.LineItemTotal || 0) +
        (cartDetailState?.CartItems?.LineItemTotal || 0);
      setProductGuestTotal(productTotal);
      let sampleDiscount = 0;
      cartDetailState?.Samples?.CartItem?.forEach((item) => {
        sampleDiscount += item?.PromotionDiscount || 0;
      });

      let cartItemsDiscount = 0;

      cartDetailState?.CartItems?.CartItem?.forEach((item) => {
        cartItemsDiscount += item?.PromotionDiscount || 0;
      });

      setTotalGuestDiscount(sampleDiscount + cartItemsDiscount);
    } else {
      setTotalGuestDiscount(0);
      setProductGuestTotal(0);
    }
  }, [cartDetailState, localCart]);

  if (cartDetailState === null && !isAuthenticated) {
    return;
  }

  return (
    <>
      {localData &&
      localData?.length > 0 &&
      cartDetailState &&
      (cartDetailState?.CartItems?.CartItem?.length > 0 ||
        cartDetailState?.Samples?.CartItem.length > 0) ? (
        <div className="bg-tonal-gray rounded-md md:mt-8">
          <div className="py-5 px-6 flex flex-col gap-y-3">
            <Text field={Title} tag="h4" className="text-center" />
            <div className="flex flex-col gap-y-6">
              <hr className="text-dark-gray opacity-30" />
              <div className="flex justify-between">
                <div className="flex flex-col gap-y-4 font-latoBold text-dark-gray">
                  <p>{t('Order_ProductTotal')}</p>
                  {totalGuestDiscount !== 0 && <p>{t('Order_Discount')}</p>}
                  <p>{t('Order_Shipping')}</p>
                  <p>{t('Order_EstimatedTax')}</p>
                </div>
                <div className="flex flex-col text-dark-gray text-end gap-y-4">
                  <p>{`$${productGuestTotal?.toFixed(2)}`}</p>
                  {totalGuestDiscount !== 0 && (
                    // <p className="text-light-slate-red">{`-$${totalGuestDiscount}`}</p>
                    <p>TBD</p>
                  )}
                  <p>TBD</p>
                  <p>TBD</p>
                </div>
              </div>
              <div className="flex flex-col gap-y-3">
                <hr className="text-dark-gray opacity-30" />
                <div className="flex justify-between">
                  <p className="font-latoBold text-dark-gray">{t('Order_SubTotal')}</p>
                  <p className="font-latoBold text-dark-gray text-end">
                    {`$${productGuestTotal?.toFixed(2)}`}
                  </p>
                </div>
                <hr className="text-dark-gray opacity-30" />
              </div>

              <div className="flex justify-center">
                <Button
                  disabled={isSampleNotReadyForDisplay || isItemNotReadyForDisplay}
                  className={`h-11 flex gap-x-3 text-base ${isSampleNotReadyForDisplay || isItemNotReadyForDisplay ? 'opacity-55 hover:opacity-55 hover:bg-dark-gray' : ''}`}
                  onClick={handleDivertToLogin}
                  isCTATextInCaps={props?.isCtaCaps || ''}
                >
                  <IoIosUnlock />
                  {t('Order_SecureCheckout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default OrderSummaryGuest;

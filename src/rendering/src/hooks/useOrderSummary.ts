import { useQuery } from '@tanstack/react-query';
import { CartService } from '@/api/services/CartService';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/data/atoms/authorization';
import useCart from './useCart';
import { useEffect, useState } from 'react';
// import cartAtom from '@/core/cartStore/cartState';

// Custom hook to get cart state
export const useOrderSummary = (isFetchEnabled: boolean = true) => {
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const { isCartListError, isCartListLoading } = useCart();
  // const [localCart] = useAtom(cartAtom);
  // const queryClient = useQueryClient();
  const [isSampleNotReadyForDisplay, setIsSampleNotReadyForDisplay] = useState<boolean>(false);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderSummaryLength, setOrderSummaryLength] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>('');

  const {
    data: fetchedCartData,
    isLoading,
    refetch: refetchCartData,
    isRefetching,
  } = useQuery({
    queryKey: ['getCartData'],
    queryFn: () => {
      return CartService.cartGetOrderSummary();
    },
    enabled: isFetchEnabled && isAuthenticated && !isCartListLoading && !isCartListError,
    refetchOnWindowFocus: false,
  });
  // const triggerRefetch = () => {
  //   queryClient.invalidateQueries({ queryKey: [`getCartData`] });
  // };
  // useEffect(() => {
  //   triggerRefetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [localCart]);

  // useEffect(() => {
  //   if (isDeleteCartItem !== null) {
  //     refetchCartData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isDeleteCartItem]);

  useEffect(() => {
    if (fetchedCartData && fetchedCartData !== undefined) {
      setOrderTotal(fetchedCartData?.Order?.Total ?? 0);
      setOrderId(fetchedCartData?.Order?.ID ?? '');
      if (fetchedCartData?.LineItems && fetchedCartData?.LineItems?.length > 0) {
        setOrderSummaryLength(fetchedCartData?.LineItems?.length);
        setIsSampleNotReadyForDisplay(
          Boolean(
            fetchedCartData?.LineItems?.some(
              (item: { Product: { xp: { ReadyForDisplay: boolean } } }) =>
                item.Product?.xp?.ReadyForDisplay === false
            )
          )
        );
      } else {
        setOrderSummaryLength(0);
        setIsSampleNotReadyForDisplay(false);
      }
    } else {
      setOrderId('');
      setOrderSummaryLength(0);
      setIsSampleNotReadyForDisplay(false);
      setOrderTotal(0);
    }
  }, [fetchedCartData]);

  return {
    fetchedCartData,
    isLoading,
    refetchCartData,
    isRefetching,
    orderTotal,
    orderSummaryLength,
    orderId,
    isSampleNotReadyForDisplay,
  };
};

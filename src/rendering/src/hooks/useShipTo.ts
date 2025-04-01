import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartDetailAtom } from '@/core/cartStore/cartState';
// Custom hook to get cart state
export const useShipTo = () => {
  //   const queryClient = useQueryClient();
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isOnlySamples, setIsOnlySamples] = useState(false);
  const [isOnlyItems, setIsOnlyItems] = useState(false);
  const [sampleAndItem, setSampleAndItem] = useState(false);
  const [cachedData, setCachedData] = useState<CartItemDetails | null>(null);

  //   const cachedData = queryClient.getQueryData<CartItemDetails>(['cartGetCartListItems']);
  //   console.log('cachedData:', cachedData);
  // const { data }: { data?: CartItemDetails; error: unknown } = useQuery({
  //   queryKey: [`cartGetCartListItems`], // TODO : Add id of the user
  //   queryFn: () => CartService.cartGetCartListItems(),
  //   enabled: isAuthenticated,
  // });
  useEffect(() => {
    if (cachedData) {
      const cartItems = cachedData.CartItems?.LineItemCount;

      const sampleItems = cachedData.Samples?.LineItemCount;

      const newIsOnlySamples = sampleItems > 0 && cartItems === 0;
      const newIsOnlyItems = sampleItems === 0 && cartItems > 0;
      const newSampleAndItem = sampleItems > 0 && cartItems > 0;

      setIsOnlySamples(newIsOnlySamples);
      setIsOnlyItems(newIsOnlyItems);
      setSampleAndItem(newSampleAndItem);
    } else {
      setIsOnlySamples(false);
      setIsOnlyItems(false);
      setSampleAndItem(false);
    }
  }, [cachedData]);

  useEffect(() => {
    if (cartDetailState) {
      setCachedData(cartDetailState);
    }
  }, [cartDetailState]);

  return { isOnlySamples, isOnlyItems, sampleAndItem };
};

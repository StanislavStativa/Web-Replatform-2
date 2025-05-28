import { CartLineItem, CartProduct, CartService } from '@/api';
import { CartData, CartItemDetails } from '@/core/cartStore/CartStoreType';
import cartAtom, {
  cartDetailAtom,
  deleteGuestItem,
  pathItemFlag,
  stopDataSync,
} from '@/core/cartStore/cartState';
import { useCartState } from '@/core/cartStore/useCartState';
import {
  confirmationProductId,
  itemConfirmationModal,
  itemConfirmationModalImage,
  modalOpen,
  IsSample,
  SampleModalAlertSummary,
  IsSpecialOrder,
  loaderAddItem,
  isNotAddtoCartErr,
} from '@/core/molecules/Modal/atom';
import { authorizationAtom } from '@/data/atoms/authorization';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import {
  checkAnonymousAndRefreshToken,
  checkTokenAndRefreshToken,
  clearTokens,
  clearUserDetails,
} from '@/utils/authUtils';
import { anonymousSignIn } from '@/data/order-cloud/auth.service';
import { useRouter } from 'next/router';

const useCart = (isFetchEnabled: boolean = true) => {
  const queryClient = useQueryClient();
  const {
    addCartState,
    updateAmount,
    removeCartItem,
    clearCart,
    increaseAmount,
    decreaseAmount,
    patchAmount,
    removeCart,
    removeCartSampleItem,
  } = useCartState();
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const setAuthorizationAtom = useSetAtom(authorizationAtom);
  // local state
  const [localCart] = useAtom(cartAtom);
  const router = useRouter();
  const [cartDetailState, setCartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [, setIsModalOpen] = useAtom(modalOpen);
  const [, setIsItemConfirmationModalOpen] = useAtom(itemConfirmationModal);
  const [, setIsSample] = useAtom(IsSample);
  const [, setIsSpecailOrder] = useAtom(IsSpecialOrder);
  const [, sampleModalAlertSummary] = useAtom(SampleModalAlertSummary);
  const [, setProductImage] = useAtom(itemConfirmationModalImage);
  const [, setLoaderAddItem] = useAtom(loaderAddItem);
  const [, setAddtoCartErr] = useAtom(isNotAddtoCartErr);
  const [productId] = useAtom(confirmationProductId);
  const [isDeleteGuest, setIsDeleteGuest] = useAtom(deleteGuestItem);
  const [isStopDataSync] = useAtom(stopDataSync);
  // state for patching quantity
  const [patchFlag, setPatchFlag] = useAtom(pathItemFlag);
  const [, setHasMounted] = useState(false);
  const [isGuestCartError, setIsGuestCartError] = useState<boolean>(true);

  const cartItems = cartDetailState?.CartItems?.CartItem;
  const sampleItems = cartDetailState?.Samples?.CartItem;
  const [localSkuImageUrl, setLocalSkuImageUrl] = useState<string | undefined>(undefined);
  const [localIsSample, setLocalIsSample] = useState<boolean>(false);
  const [localIsSpecialOrder, setLocalIsSpecialOrder] = useState<boolean>(false);
  // mutation for guestCart
  const getGuestCartMutation = useMutation({
    mutationFn: async ({ cartProduct }: { cartProduct: CartProduct[] }) => {
      console.time('getGuestCart');
      const tokenRefreshed = await checkAnonymousAndRefreshToken(); // Call the common function
      if (tokenRefreshed) {
        await anonymousSignIn();
      }

      const result = await CartService.cartGetGuestCartListItems({ cartProduct });
      console.timeEnd('getGuestCart'); // Corrected the method name
      return result;
    },
    onSuccess: (data: CartItemDetails) => {
      if (data && localCart?.length > 0) {
        setCartDetailState(data);
      } else {
        setCartDetailState(null);
      }
      setIsGuestCartError(false);
    },
    onError: () => {
      setCartDetailState(null);
      setIsGuestCartError(true);
    },
  });

  const isGuestCardPending = getGuestCartMutation?.isPending;

  // query for getCartListItems
  const {
    data,
    isError: isCartListError,
    error,
    isLoading: isCartListLoading,
    refetch,
  }: {
    data?: CartItemDetails;
    error: unknown;
    isError: boolean;
    isLoading: boolean;
    refetch: () => void;
  } = useQuery({
    queryKey: [`cartGetCartListItems`, isAuthenticated],
    queryFn: () => CartService.cartGetCartListItems(),
    enabled: isAuthenticated && isFetchEnabled,
    retry: 0,
  });

  // refetching getCartListItems
  const triggerRefetch = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: [`getCartData`] });
  };
  // mutation to update quantity
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number; id?: string }) =>
      CartService.cartUpdateCartItemQuantity(productId, quantity),
    onSuccess: (_, variables) => {
      setLoaderAddItem(false);
      updateAmount(variables.id ?? '', variables.quantity);
      setProductImage(localSkuImageUrl ?? '');
      setIsSample(localIsSample);
      setIsItemConfirmationModalOpen(true);
      setIsSpecailOrder(localIsSpecialOrder);
      setAddtoCartErr(true);
      refreshCart();
      // triggerRefetch();
    },
    onError: () => {
      setAddtoCartErr(false);
      setLoaderAddItem(false);
      setProductImage(localSkuImageUrl ?? '');
      setIsSample(localIsSample);
      setIsSpecailOrder(localIsSpecialOrder);
      setIsItemConfirmationModalOpen(true);
      sampleModalAlertSummary(
        'Quantity given cannot exceed the maximum as per price schedule restrictions.'
      );
      refreshCart();
    },
  });

  // mutation to delete all cart items
  const removeAllMutation = useMutation({
    mutationFn: () => CartService.cartRemoveAllCartItems(),
    onSuccess: () => {
      triggerRefetch();
    },
  });

  const isRemoveAllPending = removeAllMutation?.isPending;

  // mutation to delete a single item/sample
  const deleteMutation = useMutation({
    mutationKey: ['deleteCartItem', productId],
    mutationFn: (cartLineId: string) => CartService.cartRemoveCartLineItem(cartLineId),
    onSuccess: () => {
      triggerRefetch();
      // queryClient.invalidateQueries({ queryKey: ['getCartData'] });
    },
  });

  const getGuestCart = () => {
    if (!isAuthenticated) {
      setLoaderAddItem(false);
      // Handle Guest Cart
      getGuestCartMutation.mutate({ cartProduct: localCart });
    }
  };

  // mutation to add item/sample to cart
  const addMutation = useMutation({
    mutationKey: ['addedItemToCart'],
    mutationFn: ({
      productId,
      isSample,
      sku,
      qty,
    }: {
      productId: string;
      isSample: boolean;
      sku: string;
      qty?: string;
    }) =>
      CartService.cartAddToCart({
        cartLineItems: [
          {
            quantity: qty ?? '1',
            productId: productId,
            isSample,
            productSKU: sku,
          },
        ],
      }),
    onSuccess: () => {
      setLoaderAddItem(false);
      setAddtoCartErr(true);
      if (isAuthenticated) {
        // addCartState({
        //   productId: productId,
        //   quantity: Number(variable?.qty),
        //   isSample: variable?.isSample,
        //   productSKU: variable?.sku,
        // });
        setProductImage(localSkuImageUrl ?? '');
        setIsSample(localIsSample);
        setIsSpecailOrder(localIsSpecialOrder);
        setIsItemConfirmationModalOpen(true);
        refreshCart();
        // triggerRefetch();
        queryClient.invalidateQueries({ queryKey: ['getCartData'] });
      } else if (!isAuthenticated) {
        getGuestCart();
      }
    },
    onError: () => {
      setAddtoCartErr(false);
      setLoaderAddItem(false);
      setProductImage(localSkuImageUrl ?? '');
      setIsSample(localIsSample);
      setIsSpecailOrder(localIsSpecialOrder);
      setIsItemConfirmationModalOpen(true);
      sampleModalAlertSummary(
        'Quantity given cannot exceed the maximum as per price schedule restrictions.'
      );
      refreshCart();
    },
  });
  const addAllMutation = useMutation({
    mutationKey: ['addedItemToCart'],
    mutationFn: (item: Array<CartLineItem>) =>
      CartService.cartAddToCart({
        cartLineItems: item,
      }),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCartData'] });
      triggerRefetch();
    },
    onError: () => {},
  });

  const isAddToCartPending = addMutation?.isPending;

  // function to perform guestCart api fetch

  // function to perform deletion of a single item
  // Refactored deleteItem function for clarity and efficiency
  const deleteItem = async ({ cartLineId, localId }: { cartLineId: string; localId: string }) => {
    console.log('deleteItem called', cartLineId, localId);
    // syncCart();
    await removeCartItem(productId ?? '');
    if (isAuthenticated) {
      deleteMutation.mutate(cartLineId);
    } else {
      // Handle guest cart deletion
      if (localCart.length <= 1) {
        clearCart();
        setCartDetailState(null);
        removeCart();
        setTimeout(() => {
          getGuestCartMutation.mutate({ cartProduct: [] });
        }, 200);
      } else {
        setIsDeleteGuest(true);
        // router.reload();
      }
    }
    setIsModalOpen(false);
  };

  // function to perform deletion of all the items
  const deleteAllData = async () => {
    if (isAuthenticated) {
      removeAllMutation.mutate();
    } else {
      removeCart();
      setTimeout(() => {
        getGuestCartMutation.mutate({ cartProduct: [] });
      }, 200);
    }
    // delete all products in local cart

    clearCart();
    setCartDetailState(null);
    await queryClient.invalidateQueries({ queryKey: [`getCartData`] });
    setIsModalOpen(false);
  };

  // function to increase quantity
  const increaseQuantity = ({
    CartLineID,
    ProductId,
    newQuantity,
    isSample,
  }: {
    CartLineID: string | undefined;
    ProductId: string;
    newQuantity: number;
    isSample?: boolean;
  }) => {
    if (isSample) return;
    if (isAuthenticated && CartLineID) {
      updateMutation.mutate({ productId: CartLineID, quantity: newQuantity });
    } else if (!isAuthenticated) {
      getGuestCart();
    }
    // increase amount in local
    increaseAmount(ProductId ?? '');
  };

  // function to increase quantity
  const decreaseQuantity = ({
    CartLineID,
    ProductId,
    newQuantity,
    isSample,
  }: {
    CartLineID: string | undefined;
    ProductId: string;
    newQuantity: number;
    isSample?: boolean;
  }) => {
    if (isSample) return;
    if (isAuthenticated && CartLineID) {
      updateMutation.mutate({ productId: CartLineID, quantity: newQuantity });
    } else if (!isAuthenticated) {
      getGuestCart();
    }
    // decrease amount in local
    decreaseAmount(ProductId ?? '');
  };

  //function to check if current product is already in cart
  const isProductInCart = (productId: string) => {
    if (cartItems) {
      return cartItems.some((item) => item.ProductId === productId);
    }
    return false;
  };

  //function to check if current product is already in local cart
  const isProductInLocalCart = (productId: string) => {
    return localCart.some((item) => item.productId === productId);
  };

  //fn to get qty of the product in cart
  const getQuantity = (productId: string) => {
    if (cartItems) {
      const item = cartItems.find((item) => item.ProductId === productId);
      return item?.Quantity;
    }
    return 0;
  };

  //fn to get CartLineId of the product in cart
  const getCartLineId = (productId: string) => {
    if (cartItems) {
      const item = cartItems.find((item) => item.ProductId === productId);
      return item?.CartLineID;
    }
    return undefined;
  };

  //fn to get productId from local cart using CartLineId
  const getProductIdFromLocal = (cartLineId: string) => {
    const item = localCart.find((item) => item.productId === cartLineId);
    return item?.productId;
  };

  //fn to get qty of the product in local cart
  const getQuantityFromLocal = (productId: string) => {
    const item = localCart.find((item) => item.productId === productId);
    return item?.quantity;
  };

  //fn to get if product isSample from local cart
  const isSampleFromLocal = (productId: string) => {
    const item = localCart.find((item) => item.productId === productId);
    return item?.isSample;
  };

  // function to perform add to cart
  const addToCart = ({
    productId,
    sku,
    sku_image_url,
    quantity = '1',
    isSample,
    samplemodalAlertSummary = '',
    isSpecialOrder = false,
  }: {
    productId: string;
    sku: string;
    sku_image_url?: string;
    quantity: string;
    isSample: boolean;
    samplemodalAlertSummary?: string;
    isSpecialOrder?: boolean;
  }) => {
    const isProductPresent = isProductInCart(sku);
    const isProductPresentInLocal = isProductInLocalCart(sku);
    const isSampleInLocal = isSampleFromLocal(sku);
    setLoaderAddItem(true);

    // Store the passed values in local state
    setLocalSkuImageUrl(sku_image_url);
    setLocalIsSample(isSample);
    setLocalIsSpecialOrder(isSpecialOrder);

    if ((isProductPresentInLocal || isProductPresent) && isSampleInLocal && isSample) {
      setLoaderAddItem(false);
      return;
    }

    if ((isProductPresent || isProductPresentInLocal) && !isSample) {
      setLoaderAddItem(false);
      const currentQty = isAuthenticated ? getQuantity(sku) : getQuantityFromLocal(sku);
      const patchQty = currentQty ? currentQty + parseInt(quantity) : parseInt(quantity);

      const cartLineId = getCartLineId(sku);
      if (isAuthenticated && cartLineId) {
        setLoaderAddItem(true);
        updateMutation.mutate({ productId: cartLineId ?? '', quantity: patchQty });
        // Invalidate query to refetch the data
        queryClient.invalidateQueries({ queryKey: [`getCartData`] });
      } else {
        setProductImage(sku_image_url ?? '');
        setIsSample(isSample);
        sampleModalAlertSummary(samplemodalAlertSummary);
        setIsItemConfirmationModalOpen(true);
        setIsSpecailOrder(isSpecialOrder);
        setAddtoCartErr(true);
        refreshCart();
      }
      patchAmount(sku, parseInt(quantity));
      // Fetch guest cart again
      getGuestCart();
    } else {
      if (isAuthenticated) {
        sampleModalAlertSummary(samplemodalAlertSummary);
        addMutation.mutate({
          productId: productId,
          isSample: isSample,
          sku: sku,
          qty: quantity.toString(),
        });
      } else {
        addCartState({
          productId: productId,
          quantity: parseInt(quantity),
          isSample: isSample,
          productSKU: sku,
        });
        setProductImage(sku_image_url ?? '');
        setIsSample(isSample);
        sampleModalAlertSummary(samplemodalAlertSummary);
        setIsItemConfirmationModalOpen(true);
        setIsSpecailOrder(isSpecialOrder);
        setAddtoCartErr(true);
        refreshCart();
      }
    }
  };

  const addAllToCart = debounce((addArray: CartLineItem[]) => {
    if (isAuthenticated) {
      addAllMutation.mutate(addArray);
    }
  }, 300);

  //fn to refresh cart based on auth
  const refreshCart = () => {
    //  setLoaderAddItem(false);
    if (isAuthenticated) {
      triggerRefetch();
    } else {
      getGuestCart();
    }
    // syncCart();
  };

  // funtion to add to local state
  const addItemsToLocal = useCallback(
    ({ items, isSample = false }: { items: CartData[]; isSample?: boolean }) => {
      items.forEach((item) => {
        addCartState({
          productId: item?.ProductId,
          quantity: isSample ? 1 : item?.Quantity,
          isSample: isSample ?? false,
          productSKU: item?.ProductId,
          price: Number(item?.LinePrice),
        });
      });
    },
    [addCartState]
  );

  // function to sync cart and api items
  const syncCart = () => {
    if (!data) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }
    if (isStopDataSync) {
      return;
    }

    const localCartSet = new Set(localCart.map((item) => item.productId));
    const localSampleCartSet = localCart?.filter(
      (item) => item?.productId && item?.isSample === true
    );
    const itemsToAddToLocalCart = data.CartItems?.CartItem.filter(
      (apiItem) => !localCartSet.has(apiItem.ProductId)
    );

    const samplesToAddToLocalCart = data.Samples?.CartItem.filter(
      (apiItem) => !localCartSet.has(apiItem.ProductId)
    );

    if (samplesToAddToLocalCart?.length > 0) {
      addItemsToLocal({ items: samplesToAddToLocalCart, isSample: true });
    }

    if (itemsToAddToLocalCart?.length > 0 && localCartSet?.size > 1) {
      addItemsToLocal({ items: itemsToAddToLocalCart });
    }

    //adding local sample to api
    //get unique id of sample in api
    const sampleCartSet = new Set(data?.Samples?.CartItem.map((item) => item?.ProductId));
    const itemCartSet = new Set(data?.CartItems?.CartItem.map((item) => item?.ProductId));
    const cartLength = data?.CartItems?.LineItemCount + data?.Samples?.LineItemCount;
    //get the sample not in api but in local
    // Transforming the localCart items to match the CartLineItem type
    const filteredLocalSampleCartSet = localSampleCartSet?.filter(
      (item) => !sampleCartSet?.has(item?.productId)
    );

    if (localSampleCartSet?.length >= 15) {
      filteredLocalSampleCartSet?.forEach((item) => removeCartSampleItem(item?.productId));
    }

    const samplesToAddToApi =
      localCart &&
      localCart.length > 0 &&
      localCart
        ?.filter(
          (localItem) => localItem?.isSample === true && !sampleCartSet?.has(localItem?.productId)
        )
        .map((item) => ({
          ...item,
          quantity: item?.quantity?.toString(), // Convert quantity to string
        }));
    const itemsToAddToApi =
      localCart &&
      localCart.length > 0 &&
      localCart
        ?.filter(
          (localItem) => localItem?.isSample === false && !itemCartSet?.has(localItem?.productId)
        )
        .map((item) => ({
          ...item,
          quantity: item?.quantity?.toString(), // Convert quantity to string
        }));

    if (samplesToAddToApi && samplesToAddToApi.length > 0 && cartLength !== 0) {
      setTimeout(() => {
        addAllMutation.mutate(samplesToAddToApi);
      }, 1000);

      // addAllToCart(samplesToAddToApi);
    }
    if (itemsToAddToApi && itemsToAddToApi.length > 0 && cartLength !== 0) {
      setTimeout(() => {
        addAllMutation.mutate(itemsToAddToApi);
      }, 1000);
      // addAllToCart(samplesToAddToApi);
    }
    let addArray: CartLineItem[] = [];

    // Perform diff between localStorage cart and API cart
    if (localCart?.length === 0 && data && data?.CartItems?.LineItemCount > 0) {
      // Merge API cart to localStorage cart
      // Add items (productid and qty) from API to localStorage
      if (cartItems) {
        addItemsToLocal({ items: cartItems });
      } else if (sampleItems) {
        addItemsToLocal({ items: sampleItems, isSample: true });
      }
    } else if (
      localCart?.length > 0 &&
      data.CartItems?.LineItemCount === 0 &&
      data?.Samples?.LineItemCount === 0
    ) {
      // Merge localStorage cart to API cart
      // Add items (productid and qty) from localStorage to API
      localCart.forEach((item) => {
        const tempArray = [
          ...addArray,
          { productId: item?.productId, quantity: item?.quantity?.toString() },
        ];
        addArray = tempArray;
      });
    } else if (
      localCart?.length > 0 &&
      data &&
      (data?.CartItems?.LineItemCount > 0 || data?.Samples?.LineItemCount > 0)
    ) {
      const items = data?.CartItems?.CartItem;

      // Check if quantity of specific item is different in localStorage and API cart
      localCart?.forEach((local) => {
        items?.forEach(async (apiItem) => {
          if (local?.productId === apiItem?.ProductId) {
            // If local quantity is greater than api qty
            if (local?.quantity > apiItem?.Quantity) {
              if (!patchFlag && !addAllMutation.isPending) {
                // Mutation to add to cart
                addAllMutation.mutate([
                  {
                    productId: local?.productId,
                    quantity: local?.quantity.toString(),
                  },
                ]);
                if (isAuthenticated) {
                  // Invalidate query to refetch the data
                  queryClient.invalidateQueries({ queryKey: [`getCartData`] });
                } else {
                  getGuestCart();
                }
                // Api will add the difference in quantity
                const newLocalQty = local?.quantity + apiItem?.Quantity;
                console.log('Final qty in both carts', newLocalQty);
                setPatchFlag(true);
              }
            } else if (local?.quantity < apiItem?.Quantity) {
              if (!patchFlag && !addAllMutation.isPending) {
                const newQty = apiItem?.Quantity + local?.quantity;
                // Add the difference in quantity to local cart
                await updateAmount(local?.productId, apiItem?.Quantity);
                // Add the local amount to api cart
                console.log('Final qty in both carts', newQty);
                setPatchFlag(true);
              }
            } else {
              // If quantity is the same then break
              return;
            }
          }
        });
      });
    }

    if (addArray.length > 0) {
      addAllToCart(addArray);
    }

    if (data) {
      setCartDetailState(data);
    }
  };

  //Fn to check number of samples in local cart
  const getLocalNumberOfSamples = () => {
    return localCart.filter((item) => item.isSample).length;
  };

  //Fn to check number of samples in api cart
  const getApiNumberOfSamples = () => {
    return sampleItems?.length;
  };

  const isPriceUpdated =
    (cartItems?.some((item) => item?.IsPriceUpdated) ||
      sampleItems?.some((item) => item?.IsPriceUpdated)) ??
    false;

  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  useEffect(() => {
    if (data && isAuthenticated && isStopDataSync === false) {
      setCartDetailState(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isAuthenticated, isStopDataSync]);
  useEffect(() => {
    if (!isAuthenticated && localCart?.length > 0 && isDeleteGuest) {
      getGuestCart();
      setIsDeleteGuest(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCart, isAuthenticated, isDeleteGuest]);

  useEffect(() => {
    if (isCartListError) {
      const checkAndRefresh = async () => {
        try {
          const shouldRefresh = await checkTokenAndRefreshToken();
          if (shouldRefresh) {
            // router.replace('/');
            clearTokens();
            removeCart();
            clearUserDetails();
            setCartDetailState(null);
            setAuthorizationAtom({ isAuthenticated: false, assignedRoles: [] });
            refreshCart();
            setTimeout(() => {
              router.replace('/');
            }, 300);
          } else {
            return;
          }
        } catch (error) {
          console.error('Error checking or refreshing token:', error);
        }
      };

      checkAndRefresh(); // Call the async function
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartListError, router]);

  return {
    getGuestCart,
    isProductInCart,
    isProductInLocalCart,
    syncCart,
    triggerRefetch,
    deleteAllData,
    deleteItem,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    isCartListError,
    error,
    isCartListLoading,
    isGuestCartError,
    getApiNumberOfSamples,
    getLocalNumberOfSamples,
    getProductIdFromLocal,
    refreshCart,
    isGuestCardPending,
    isAddToCartPending,
    isRemoveAllPending,
    isPriceUpdated,
  };
};
export default useCart;

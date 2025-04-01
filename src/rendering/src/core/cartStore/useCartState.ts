import { useAtom } from 'jotai';
import cartAtom from './cartState';
import { CartItem } from './CartStoreType';
import useLocalStorage from '@/utils/useLocalStorage';
export const useCartState = () => {
  const { removeData } = useLocalStorage();
  const [cartState, setCartState] = useAtom<CartItem[]>(cartAtom);
  // Merge te cart
  const mergeCart = (savedCart: CartItem[]) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = prevCart.map((item) => {
        const isItemAvailable = savedCart.find(
          (savedItem) => item.productId === savedItem.productId
        );
        if (isItemAvailable) {
          item.quantity += isItemAvailable.quantity;
        }
        return item;
      });
      return updatedCart;
    });
  };

  // Add Item to the cart
  const addCartState = (newProduct: CartItem) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const isItemExisted = updatedCart.find((item) => newProduct.productId === item.productId);
      const isItemSample = updatedCart.find((item) => item.isSample);
      if (isItemExisted && isItemSample) {
        // If item exists but is a sample, create a different entry where the item is not a sample
        updatedCart.push(newProduct);
        return updatedCart;
      } else if (isItemExisted && !isItemSample) {
        // If item exists and is not a sample, merge the quantity
        mergeCart([newProduct]);
        return updatedCart;
      }

      updatedCart.push(newProduct);
      return updatedCart;
    });
  };

  // Remove Item to the cart
  const removeCartItem = async (productId: string) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const filteredItem = updatedCart.filter((item) => item.productId !== productId);

      return filteredItem;
    });
    //
  };

  // Remove SampleItem to the cart
  const removeCartSampleItem = async (productId: string) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const filteredItem = updatedCart.filter(
        (item) => item.isSample && item.productId !== productId
      );

      return filteredItem;
    });
    //
  };

  //  Increase Amount
  const increaseAmount = (productId: string) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const item = updatedCart.find((item) => item.productId === productId);
      if (item) {
        item.quantity++;
      }
      return updatedCart;
    });
  };
  // Patch amount
  const patchAmount = async (productId: string, quantity: number) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const item = updatedCart.find((item) => item.productId === productId);
      if (item) {
        item.quantity += quantity;
      }
      return updatedCart;
    });
  };

  // to update cart with api quantity
  const updateAmount = async (productId: string, quantity: number) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const item = updatedCart.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
      return updatedCart;
    });
  };
  // Decrease Amount
  const decreaseAmount = (productId: string) => {
    setCartState((prevCart: CartItem[]) => {
      const updatedCart = [...prevCart];
      const item = updatedCart.find((item) => item.productId === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
      return updatedCart;
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCartState([]);
  };
  // Remove the cart
  const removeCart = () => {
    setCartState([]);
    removeData('cartState');
  };

  // Submit
  const submitCart = () => {
    // Implement submit logic here
  };

  return {
    cartState,
    mergeCart,
    addCartState,
    removeCartItem,
    clearCart,
    submitCart,
    increaseAmount,
    decreaseAmount,
    patchAmount,
    updateAmount,
    removeCart,
    removeCartSampleItem,
  };
};

export const useCartSync = () => {};

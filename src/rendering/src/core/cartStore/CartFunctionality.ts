const CartFunctionality = () => {
  const getLocalStorageCartData = () => {
    const cartData = localStorage.getItem('cartState');
    return cartData ? JSON.parse(cartData) : [];
  };

  // const mergeLocalStorageToCartData = (apiResponse: CartAtomProps, type: string) => {
  //   const localStorageData = getLocalStorageCartData();
  //   if (type === 'items') {
  //     const itemLocalStorageData = localStorageData.CartItems;
  //     itemLocalStorageData?.CartItem?.forEach((localItem: CartData) => {
  //       const existingItem = apiResponse.CartItem.find(
  //         (apiItem) => localItem.ProductId === apiItem.ProductId
  //       );
  //       if (existingItem) {
  //         if (existingItem.Quantity < localItem.Quantity) {
  //           existingItem.Quantity = localItem.Quantity;
  //         }
  //       } else {
  //         apiResponse.CartItem.push(localItem);
  //       }
  //     });
  //     return apiResponse;
  //   }
  //   return apiResponse;
  // };

  return { getLocalStorageCartData };
};

export default CartFunctionality;

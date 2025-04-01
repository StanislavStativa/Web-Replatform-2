import { useAtom } from 'jotai';
import CartItemCard from '../Cart/CartItemCard/CartItemCard';
import ItemTitle from '../Cart/ItemTitle/ItemTitle';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { PRODUCT_TYPE } from '../Cart/CartItemCard/CartItemCard.types';
import { authorizationAtom } from '@/data/atoms/authorization';
import useLocalStorage from '@/utils/useLocalStorage';
import { CartItem } from '@/core/cartStore/CartStoreType';

const ItemSection = () => {
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const { getData } = useLocalStorage();
  const localData = getData<CartItem[]>('cartState');
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);

  const itemCartData = cartDetailState?.CartItems;

  if (!isAuthenticated && localData && localData?.length <= 0) {
    return null;
  }
  if (!itemCartData) {
    return null;
  }

  return (
    <>
      {itemCartData.LineItemCount > 0 ? (
        <div className="flex flex-col gap-2.5 py-4 px-3.7 lg:px-9.5 border border-gray rounded-xl">
          <div className="flex flex-col items-start gap-6">
            <ItemTitle
              type={PRODUCT_TYPE.ITEM}
              LineItemCount={itemCartData?.LineItemCount}
              LineItemTotal={itemCartData?.LineItemTotal}
            />
            {itemCartData?.CartItem?.map((item) => {
              return (
                <CartItemCard
                  key={item?.ProductId}
                  productId={item.ProductId}
                  type={PRODUCT_TYPE.ITEM}
                  productUrl={item.ImageUrl}
                  returnUrl={item?.ReturnPolicyUrl}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};
export default ItemSection;

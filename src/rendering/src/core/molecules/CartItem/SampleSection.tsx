import { useAtom } from 'jotai';

import CartItemCard from '../Cart/CartItemCard/CartItemCard';
import ItemTitle from '../Cart/ItemTitle/ItemTitle';
import { CartItem, CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { PRODUCT_TYPE } from '../Cart/CartItemCard/CartItemCard.types';
import { ITypesSampleSection } from './CartItem.types';
import useLocalStorage from '@/utils/useLocalStorage';
import { authorizationAtom } from '@/data/atoms/authorization';

const SampleSection = ({ sampleSummary }: ITypesSampleSection) => {
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const { getData } = useLocalStorage();
  const localData = getData<CartItem[]>('cartState');
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);

  const sampleCartData = cartDetailState?.Samples;

  if (!isAuthenticated && localData && localData?.length <= 0) {
    return null;
  }
  if (!sampleCartData) {
    return null;
  }
  return (
    <>
      {sampleCartData.LineItemCount > 0 ? (
        <div className="flex flex-col gap-2.5 py-4 px-3.7 lg:px-9.5 border border-gray rounded-xl">
          <div className="flex flex-col items-start gap-6">
            <ItemTitle
              type={PRODUCT_TYPE.SAMPLE}
              LineItemTotal={sampleCartData.LineItemTotal}
              LineItemCount={sampleCartData.LineItemCount}
              SampleModalAlertSummary={sampleSummary?.value}
            />
            {sampleCartData.CartItem.map((sample) => {
              return (
                <CartItemCard
                  key={sample?.ProductId}
                  productId={sample.ProductId}
                  productUrl={sample.ImageUrl}
                  type={PRODUCT_TYPE.SAMPLE}
                  returnUrl={sample?.ReturnPolicyUrl}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};
export default SampleSection;

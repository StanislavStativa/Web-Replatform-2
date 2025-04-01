import { useI18n } from 'next-localization';
import { PRODUCT_TYPE } from '../Cart/CartItemCard/CartItemCard.types';
import ItemTitle from '../Cart/ItemTitle/ItemTitle';
import CartHoverCard from './CartHoverCard';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { useAtom } from 'jotai';
import { CartHoverProps } from './HeaderCTAOverlay.type';
import Image from '@/core/atoms/Image/Image';
import { SIZE } from '@/utils/constants';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { useRouter } from 'next/navigation';
const CartHover: React.FC<CartHoverProps> = ({ props }) => {
  const router = useRouter();
  const { t } = useI18n();

  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const CartTotal = cartDetailState
    ? cartDetailState?.CartItems?.LineItemTotal + cartDetailState?.Samples?.LineItemTotal
    : 0;

  return (
    <>
      {cartDetailState &&
      (cartDetailState?.CartItems?.LineItemCount > 0 ||
        cartDetailState?.Samples?.LineItemCount > 0) ? (
        <div className="flex flex-col h-screen md:h-max overflow-hidden">
          <div className="pt-6 pl-6 flex flex-col gap-2.5 h-[calc(100vh-210px)] md:h-[calc(100vh-330px)]">
            <h1 className="flex text-2xl leading-34 font-latoBold text-dark-gray">
              {t('lbl_ShoppingCart') || 'Shopping Cart'}
            </h1>
            <div className="overflow-y-scroll pb-3 ">
              {cartDetailState?.Samples && cartDetailState?.Samples?.LineItemCount > 0 ? (
                <div className="flex flex-col gap-3 pr-3.5 pb-6">
                  <div className="flex items-start">
                    {props?.SampleIcon?.value ? (
                      <Image
                        field={{
                          value: {
                            src: props?.SampleIcon?.value?.src as string,
                            height: Number(props?.SampleIcon?.value?.height || 26),
                            width: Number(props?.SampleIcon?.value?.width || 35),
                            alt: props?.SampleIcon?.value?.alt,
                          },
                        }}
                      />
                    ) : null}
                    <h4 className="ml-3 text-base font-latoBold leading-8 flex gap-1 text-dark-gray">
                      {+cartDetailState.Samples.LineItemCount > 1
                        ? t('Cart_Samples')
                        : t('Cart_Sample')}
                      <span>({cartDetailState.Samples.LineItemCount})</span>
                    </h4>
                  </div>
                  <ItemTitle
                    type={PRODUCT_TYPE.SAMPLE}
                    LineItemTotal={cartDetailState?.Samples?.LineItemTotal}
                    LineItemCount={cartDetailState?.Samples?.LineItemCount}
                    isHovered={true}
                    SampleModalAlertSummary={props?.SampleModalAlertSummary?.value}
                  />

                  {cartDetailState?.Samples?.CartItem.map((sample) => {
                    return (
                      <CartHoverCard
                        type={PRODUCT_TYPE.SAMPLE}
                        product={sample}
                        key={sample?.ProductId}
                        productUrl={sample.ImageUrl}
                      />
                    );
                  })}
                </div>
              ) : null}

              {cartDetailState?.CartItems && cartDetailState?.CartItems?.LineItemCount > 0 ? (
                <div className="flex flex-col gap-3 pr-3.5 pb-3">
                  <div className="flex items-start">
                    {props?.ItemIcon?.value ? (
                      <Image
                        field={{
                          value: {
                            src: props?.ItemIcon?.value?.src as string,
                            height: Number(props?.ItemIcon?.value?.height || 26),
                            width: Number(props?.ItemIcon?.value?.width || 35),
                            alt: props?.ItemIcon?.value?.alt,
                          },
                        }}
                      />
                    ) : null}
                    <h4 className="ml-3 text-base font-latoBold leading-8 flex gap-1text-dark-gray ">
                      {+cartDetailState.CartItems.LineItemCount > 1
                        ? t('Cart_Items')
                        : t('Cart_Item')}
                      <span className="ml-1">({cartDetailState.CartItems.LineItemCount})</span>
                    </h4>
                  </div>
                  <ItemTitle
                    type={PRODUCT_TYPE.ITEM}
                    LineItemTotal={cartDetailState?.CartItems?.LineItemTotal}
                    LineItemCount={cartDetailState?.CartItems?.LineItemCount}
                    isHovered={true}
                    SampleModalAlertSummary={props?.SampleModalAlertSummary?.value}
                  />
                  {cartDetailState?.CartItems?.CartItem.map((item) => {
                    return (
                      <CartHoverCard
                        type={PRODUCT_TYPE.ITEM}
                        product={item}
                        key={item.ProductId}
                        productUrl={item?.ImageUrl}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="bg-white text-black pt-3.6 pb-9 px-6 md:max-w-466 w-full shadow-cardHover md:rounded-b-2xl bottom-0">
            <div className="pb-6 text-base flex justify-between">
              <p className="text-base font-normal">{t('lbl_CartTotal') || 'Cart Total'} </p>
              <p className="text-2xl font-latoBold leading-8">${CartTotal?.toFixed(2)}</p>
            </div>
            {props?.OverlayCTA?.value?.text ? (
              <Button
                variant={props?.OverlayCTAColor?.value as ButtonVariant}
                size={props?.OverlayCTASize?.value as SIZE}
                className="w-full uppercase"
                onClick={() => router.push(props.OverlayCTA.value.href as string)}
              >
                {props.OverlayCTA.value.text}
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="w-full h-full pt-2.5 min-h-250 flex flex-col items-center justify-center">
          <p className="text-base cursor-pointer font-normal mb-4 w-full text-center">
            {t('Cart_ShoppingCartEmpty')}
          </p>
        </div>
      )}
    </>
  );
};
export default CartHover;

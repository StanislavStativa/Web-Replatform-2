import { CardItemProps, PRODUCT_TYPE } from './CartItemCard.types';
import CardItemPrice from './CardItemPrice';
import { IoMdInformationCircleOutline, IoMdWarning } from 'react-icons/io';
import Delete from '@/core/atoms/Icons/Delete';
import { useI18n } from 'next-localization';
import { useAtom } from 'jotai';
import { CartData, CartItemDetails } from '@/core/cartStore/CartStoreType';
import { cartDetailAtom, errorCartData } from '@/core/cartStore/cartState';
import { cn } from '@/utils/cn';
import Link from '@/core/atoms/Link/Link';
import {
  modalOpen,
  confirmationModelTitle,
  confirmationModelDescription,
  confirmationClickType,
  confirmationProductId,
  confirmationCartLineId,
  deleteItemProduct,
} from '../../Modal/atom';
import Confirmation from '../../Modal/Confirmation';
import { ClickType } from '../../Modal/modal.type';
import useCart from '@/hooks/useCart';
import Image from '@/core/atoms/Image/Image';

export type EventItemData = {
  currency: string;
  value: string;
  items: {
    item_brand: string;
    item_category: string;
    item_category2: string;
    item_category3: string;
    item_category4?: string;
    item_category5: string;
    item_id: string;
    item_name: string;
    price: number;
    discount: number;
    quantity: number;
  }[];
} | null;

const CartItemCard: React.FC<CardItemProps> = ({ productId, type, returnUrl, productUrl }) => {
  const { t } = useI18n();
  const { increaseQuantity, decreaseQuantity } = useCart(false);

  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(modalOpen);
  const [, setTitle] = useAtom(confirmationModelTitle);
  const [, setDescription] = useAtom(confirmationModelDescription);
  const [, setClickType] = useAtom(confirmationClickType);
  const [, setModalProductId] = useAtom(confirmationProductId);
  const [, setModalCartLineId] = useAtom(confirmationCartLineId);
  const [errorCartList] = useAtom(errorCartData);
  const [, setDeleteItemProduct] = useAtom(deleteItemProduct);

  const productCategory =
    type === PRODUCT_TYPE.ITEM ? cartDetailState?.CartItems : cartDetailState?.Samples;
  const product: CartData | undefined = productCategory?.CartItem.find(
    (item) => item?.ProductId === productId
  );

  const isProductDiscontinued: boolean =
    errorCartList?.some(
      (item: { ProductId: string; Message: string }) =>
        item.ProductId === productId && item.Message.trim() !== ''
    ) || false;

  const handleQuantityIncrease = () => {
    const newQuantity = product ? product?.Quantity + 1 : 1;
    increaseQuantity({
      CartLineID: product?.CartLineID ?? '',
      ProductId: product?.ProductId ?? '',
      newQuantity,
    });
  };

  const handleQuantityDecrease = () => {
    if (product && product.Quantity > 1) {
      const newQuantity = product.Quantity - 1;
      decreaseQuantity({
        CartLineID: product?.CartLineID ?? '',
        ProductId: product?.ProductId ?? '',
        newQuantity,
      });
    }
  };

  const handleRemoveItem = () => {
    setIsModalOpen(true);
    const confirmationTitle =
      type === PRODUCT_TYPE.SAMPLE ? t('Cart_RemoveSampleTitle') : t('Cart_RemoveProductTitle');

    const confirmationDescription =
      type === PRODUCT_TYPE.SAMPLE ? t('Cart_RemoveSampleText') : t('Cart_RemoveProductText');
    setTitle(confirmationTitle);
    setDescription(confirmationDescription);
    setClickType(ClickType.Delete);
    setModalProductId(product?.ProductId ?? '');
    setModalCartLineId(product?.CartLineID ?? '');

    if (product) {
      const eventData = {
        currency: 'USD',
        value: Number(product?.LinePrice * product?.Quantity)?.toFixed(2),
        items: [
          {
            discount: Number(product?.PromotionDiscount?.toFixed(2)) ?? 0,
            item_id: product?.ProductId || '',
            item_name: product?.ProductName || '',
            item_brand: product?.Brand || '',
            item_category: product?.ProductHierarchy1Name || '',
            item_category2: product?.ProductHierarchy2Name || '',
            item_category3: product?.MaterialGroup || '',
            item_category4: product?.CollectionName || '',
            item_category5: '',
            price: Number(product?.LinePrice?.toFixed(2)),
            quantity: product?.Quantity,
          },
        ],
      };
      setDeleteItemProduct(eventData);
    }
  };

  if (!product) {
    return null;
  }
  const updateProductUrl = productUrl?.replace(/SS/g, '');

  const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${updateProductUrl}?$PDPThumbnail$`;

  return (
    <>
      <section
        id="items"
        className={cn('flex items-start ', {
          'justify-between w-full': type === PRODUCT_TYPE.ITEM,
          'gap-139': type === PRODUCT_TYPE.SAMPLE,
        })}
      >
        <div
          className={cn('flex items-start', {
            'gap-3.6': type === PRODUCT_TYPE.SAMPLE,
            'gap-3.5 lg:max-w-52p': type === PRODUCT_TYPE.ITEM,
          })}
        >
          <div className="flex flex-col gap-3">
            <Link
              className="flex flex-col gap-3 min-w-139"
              field={{ href: `${product?.ProductUrl}` }}
              editable={false}
            >
              <Image
                desktopSrc={productImage}
                mobileSrc={productImage}
                className="bg-tonal-gray rounded-lg w-135 h-135 border-none"
              />
            </Link>
            <div className="flex flex-col gap-3 lg:gap-1.5 ">
              {type === PRODUCT_TYPE.ITEM && (
                <div
                  className={cn(
                    'flex items-center p-3 border rounded-lg border-dark-gray text-base font-normal text-dark-gray',
                    {
                      'justify-between': type === PRODUCT_TYPE.ITEM,
                      // 'justify-center': type === PRODUCT_TYPE.SAMPLE,
                    }
                  )}
                >
                  {type === PRODUCT_TYPE.ITEM ? (
                    <button className="leading-3.5" onClick={handleQuantityDecrease}>
                      -
                    </button>
                  ) : null}
                  <p className="font-latoBold leading-3.5">{product.Quantity}</p>
                  {type === PRODUCT_TYPE.ITEM ? (
                    <button className="leading-3.5" onClick={handleQuantityIncrease}>
                      +
                    </button>
                  ) : null}
                </div>
              )}
              <div className="flex gap-13.5 items-center ">
                <p className="text-dark-gray text-xs font-latoSemiBold w-67">
                  {type === PRODUCT_TYPE.SAMPLE ? t('Cart_Sample') : product.SellingType}
                </p>
                <button className="w-4 h-18 cursor-pointer text-red-500">
                  <Delete width={16} height={18} onClick={handleRemoveItem} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-medium text-dark-gray">#{product.ProductId}</p>
            <Link field={{ href: `${product?.ProductUrl}` }} editable={false} className="w-auto">
              <p
                className={cn('text-base text-dark-gray font-latoBold w-auto sm:-w-158 md:w-full', {
                  'lg:w-211': type === PRODUCT_TYPE.SAMPLE,
                })}
              >
                {product.ProductName}
              </p>
            </Link>

            {product.ReadyForDisplay === false ? (
              <div className="flex items-center gap-3 text-red-500 text-base font-latoSemiBold w-auto sm:-w-158 md:w-40 lg:w-211 bg-red-100 px-3 py-3 rounded-md">
                {t('cart_sample_message')}
              </div>
            ) : null}
            {isProductDiscontinued && (
              <div className="flex items-center gap-3 text-red-500">
                <IoMdWarning color="red" width={15} height={15} />
                <div className="text-xs">
                  <p>{t('product_discontinued')}</p>
                </div>
              </div>
            )}
            {!product.Returnable ? (
              <div className="flex items-center gap-3 text-dark-gray">
                <IoMdInformationCircleOutline width={15} height={15} />
                <div className="text-xs">
                  <p>{t('Cart_ItemNotReturnable')}</p>
                  <Link
                    className="text-dark-gray underline"
                    field={{ href: `${returnUrl}` }}
                    editable={false}
                  >
                    {t('Cart_ViewReturnPolicy')}
                  </Link>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col lg:hidden py-2 gap-4 items-start">
              <CardItemPrice
                ActualPrice={product.InitialPrice}
                DiscountPrice={product.LinePrice}
                PromotionDiscountText={product.PromotionDiscountText}
                SellingText={product.SellingText}
                type={type}
                PromotionDiscount={product?.PromotionDiscount}
              />
              {type === PRODUCT_TYPE.ITEM ? (
                <CardItemPrice
                  ActualPrice={product.InitialPriceTotal}
                  DiscountPrice={product.LinePriceTotal}
                  PromotionDiscountText={product.PromotionDiscountText}
                  SellingText={t('OrderReview_Total').toLowerCase()}
                  type={type}
                  PromotionDiscount={product?.PromotionDiscount}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div
          className={cn('hidden lg:flex py-2 gap-14.5 items-start', {
            'lg:w-2/5': type === PRODUCT_TYPE.ITEM,
          })}
        >
          <CardItemPrice
            ActualPrice={product.InitialPrice}
            DiscountPrice={product.LinePrice}
            PromotionDiscountText={product.PromotionDiscountText}
            SellingText={product.SellingText}
            type={type}
            PromotionDiscount={product?.PromotionDiscount}
          />
          {type === PRODUCT_TYPE.ITEM ? (
            <CardItemPrice
              ActualPrice={product.InitialPriceTotal}
              DiscountPrice={product.LinePriceTotal}
              PromotionDiscountText={product.PromotionDiscountText}
              SellingText={t('OrderReview_Total').toLowerCase()}
              type={type}
              PromotionDiscount={product?.PromotionDiscount}
            />
          ) : null}
        </div>
      </section>
      {isModalOpen ? <Confirmation /> : null}
    </>
  );
};
export default CartItemCard;

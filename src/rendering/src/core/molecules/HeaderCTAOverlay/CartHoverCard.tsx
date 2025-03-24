import Image from '@/core/atoms/Image/Image';
import { useI18n } from 'next-localization';
import { PRODUCT_TYPE } from '../Cart/CartItemCard/CartItemCard.types';
import { cn } from '@/utils/cn';
import Link from '@/core/atoms/Link/Link';
import { CartHoverCardProps } from './HeaderCTAOverlay.type';

const CartHoverCard: React.FC<CartHoverCardProps> = ({ type, product, productUrl }) => {
  const { t } = useI18n();

  const updateProductUrl = productUrl?.replace(/SS/g, '');

  const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${updateProductUrl}?$PDPThumbnail$`;

  const productPath = product.ProductUrl?.startsWith('http')
    ? product.ProductUrl.toLowerCase().split('/products/')?.[1]
    : product.ProductUrl;

  return (
    <div className="grid grid-cols-cartHoverCard gap-2.5 pb-3">
      <Link field={{ href: `${productPath}` }} editable={false}>
        <Image
          desktopSrc={productImage}
          mobileSrc={productImage}
          className="bg-tonal-gray rounded-lg w-140 h-140"
        />
      </Link>
      <div
        className={cn('flex flex-col justify-between', {
          'gap-4': type === PRODUCT_TYPE.ITEM,
        })}
      >
        {type === PRODUCT_TYPE.SAMPLE ? (
          <div className="bg-tonal-gray w-fit py-1 px-1.5 rounded-md text-xs text-dark-gray font-latoBold tracking-wider">
            {t('Cart_Sample').toUpperCase()}
          </div>
        ) : null}
        <Link field={{ href: `${productPath}` }} editable={false}>
          <p className="text-dark-gray text-base leading-6 text-left font-latoBold">
            {product.ProductName}
          </p>
        </Link>
        <div className="flex gap-4">
          {product.InitialPrice && product.InitialPriceTotal && type !== PRODUCT_TYPE.SAMPLE ? (
            <div>
              <p className="line-through text-light-gray text-base text-left">
                ${product.InitialPriceTotal?.toFixed(2)}
              </p>
              <p className="line-through text-light-gray text-base text-left">
                ${product.InitialPrice?.toFixed(2)}/{product.SellingText}
              </p>
            </div>
          ) : null}
          <div className="text-left">
            <p className="text-dark-gray text-base font-latoBold ">
              ${product.LinePriceTotal?.toFixed(2)}
            </p>
            <p className="text-dark-gray text-base font-latoRegular">
              ${product.LinePrice?.toFixed(2)}/
              {type === PRODUCT_TYPE.SAMPLE ? t('Cart_Sample').toLowerCase() : product.SellingText}
            </p>
          </div>
        </div>
        <div className="text-xs text-dark-gray font-medium text-center w-fit font-latoRegular">
          {t('Cart_Quantity')}: <span>{product.Quantity}</span>
        </div>
      </div>
    </div>
  );
};
export default CartHoverCard;

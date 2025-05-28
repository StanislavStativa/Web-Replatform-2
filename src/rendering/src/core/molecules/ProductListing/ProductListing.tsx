import React, { useEffect, useState } from 'react';
import ProductListingCards from './ProductListingCards';
import { ProductListingCard, ProductListingPageProps } from './ProductListing.type';
import { useAtom } from 'jotai';
import cartAtom, { cartDetailAtom } from '@/core/cartStore/cartState';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { loaderAddItem } from '../Modal/atom';
import { useRouter } from 'next/router';
import useCart from '@/hooks/useCart';
import { triggerEvent } from '@/utils/eventTracking';
import { event, USR_EMAIL } from '@/config';
import useLocalStorage from '@/utils/useLocalStorage';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { transformItems } from '../EmersaysTracking/EmersaysTracking';
type PLPEventData = {
  item_list_id: string;
  item_list_name: string;
  items: {
    discount: number;
    index: number;
    item_brand: string | undefined;
    item_category: string;
    item_category2: string;
    item_category3: string;
    item_category4: string;
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }[];
} | null;

const ProductListing: React.FC<ProductListingPageProps> = (props) => {
  const [localCart] = useAtom(cartAtom);
  const [loaderItem] = useAtom(loaderAddItem);
  const [plpEventData, setPlpEventData] = useState<PLPEventData>(null);
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const router = useRouter();
  const { getData } = useLocalStorage();
  const userEmail = getData<string>(USR_EMAIL);
  const { getGuestCart } = useCart(false);
  useEffect(() => {
    if (props?.products?.content?.product?.value) {
      const pathSegments = router?.asPath
        .split('?')[0] // Remove query parameters
        .replace(/^\/+/, '') // Remove leading slashes
        .split('/'); // Split into segments
      const formattedItemListId = pathSegments?.join(' > ');
      const formattedItemListName = pathSegments?.join('-');
      const productItems =
        props?.products?.content?.product?.value?.map((product, index) => {
          const price = Number(product?.final_price_purchase);
          return {
            discount: Number(
              (
                Number(product?.price_purchase_retail) - Number(product?.final_price_purchase)
              ).toFixed(2)
            ),
            index: index + 1,
            item_brand: product?.brand,
            item_category: product?.product_hierarchy1 || '',
            item_category2: product?.product_hierarchy2 || '',
            item_category3: product?.material_group || '',
            item_category4: Array.isArray(product?.collection) ? product.collection?.[0] : '', // Ensure this is always an array
            item_id: product?.sku || '',
            item_name: product?.name || '',
            price: Number(price?.toFixed(2)),
            quantity: 1,
          };
        }) || [];

      const eventData: PLPEventData = {
        item_list_id: formattedItemListId,
        item_list_name: formattedItemListName,
        items: productItems,
      };

      setPlpEventData(eventData);
    }
  }, [props?.products?.content]);

  useEffect(() => {
    if (plpEventData) {
      if (userEmail && userEmail !== '') {
        setTimeout(() => {
          window?.ScarabQueue?.push(['setEmail', userEmail]);
          if (cartDetailState) {
            const sampleItems = transformItems(cartDetailState?.Samples?.CartItem);
            const cartItems = transformItems(cartDetailState?.CartItems?.CartItem);
            window?.ScarabQueue.push(['cart', [...sampleItems, ...cartItems]]);
          }
          window?.ScarabQueue?.push(['category', plpEventData?.item_list_id]);
          window?.ScarabQueue.push(['go']);
        }, 1000);
      }

      triggerEvent({
        event: event.VIEW_ITEM_LIST,
        ecommerce: {
          item_list_id: plpEventData?.item_list_id,
          item_list_name: plpEventData?.item_list_name,
          items: plpEventData?.items,
        },
      });
    }
  }, [plpEventData]);
  useEffect(() => {
    if (localCart?.length > 0) {
      getGuestCart();
    }
  }, [localCart]);
  return (
    <div
      className={`component grid grid-cols-2 md:grid-cols-4 mx-8 mt-5 gap-5 md:gap-6 ${props?.params?.styles} ${props?.products?.content?.product?.n_item < 24 ? 'mb-10' : ''}`}
    >
      {loaderItem && <LoaderSpinner />}
      {props?.products?.content?.product?.value
        ?.reduce((uniqueProducts, product) => {
          if (!uniqueProducts?.some((p) => p?.sku === product?.sku)) {
            uniqueProducts.push(product);
          }
          return uniqueProducts;
        }, [] as ProductListingCard[])
        ?.map((product: ProductListingCard) => {
          return (
            <ProductListingCards
              {...product}
              key={product.id}
              cartItem={localCart}
              discoverRfkId={props?.rendering?.fields?.DiscoverRfkId?.value}
            />
          );
        })}
    </div>
  );
};
export default ProductListing;

import { type CartItemProps } from './CartItem.types';
import SectionHeading from './SectionHeading';
import SampleSection from './SampleSection';
import { useAtom } from 'jotai';
import ItemSection from './ItemSection';
import { useEffect, useState } from 'react';
import { authorizationAtom } from '@/data/atoms/authorization';
import { cn } from '@/utils/cn';
import useCart from '@/hooks/useCart';
import { cartWecoError, itemConfirmationModal } from '../Modal/atom';

import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
import { stopDataSync, cartDetailAtom } from '@/core/cartStore/cartState';
import { useRouter } from 'next/router';
import { CartItemDetails } from '@/core/cartStore/CartStoreType';
import { triggerEvent } from '@/utils/eventTracking';
import { event, USR_EMAIL } from '@/config';
import { transformItems } from '../EmersaysTracking/EmersaysTracking';
import useLocalStorage from '@/utils/useLocalStorage';
import { useI18n } from 'next-localization';

type cartItemData = {
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

const CartItem: React.FC<CartItemProps> = (props) => {
  const router = useRouter();
  const { t } = useI18n();

  const id = props?.params?.RenderingIdentifier;
  const {
    getGuestCart,
    isCartListError,
    isCartListLoading,
    isGuestCardPending,
    isRemoveAllPending,
    isPriceUpdated,
  } = useCart();
  const [isCartWecoError, setCartWecoError] = useAtom(cartWecoError);
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const [, setStopDataSync] = useAtom(stopDataSync);
  const { getData } = useLocalStorage();
  const userEmail = getData<string>(USR_EMAIL);
  const [isItemConfirmationModalOpen, setIsItemConfirmationModalOpen] =
    useAtom(itemConfirmationModal);
  const [hasMounted, setHasMounted] = useState(false);

  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [cartEventData, setCartEventData] = useState<cartItemData>(null);
  const [debouncedCartEventData, setDebouncedCartEventData] = useState<cartItemData>(null);

  const cartData = cartDetailState;
  useEffect(() => {
    setHasMounted(true);
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      getGuestCart();
    }
  }, [hasMounted, isAuthenticated]);

  useEffect(() => {
    setStopDataSync(false);
    if (isItemConfirmationModalOpen) {
      setIsItemConfirmationModalOpen(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isCartWecoError) {
      timeoutId = setTimeout(() => {
        setCartWecoError(false);
      }, 10000);
    }

    return () => clearTimeout(timeoutId);
  }, [isCartWecoError]);

  useEffect(() => {
    const closeModal = () => setIsItemConfirmationModalOpen(false);

    router.events.on('routeChangeStart', closeModal);
    router.events.on('routeChangeComplete', closeModal);
    router.events.on('routeChangeError', closeModal);

    // Cleanup the event listeners when the component is unmounted
    return () => {
      router.events.off('routeChangeStart', closeModal);
      router.events.off('routeChangeComplete', closeModal);
      router.events.off('routeChangeError', closeModal);
    };
  }, [router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedCartEventData === null && cartEventData) {
        setDebouncedCartEventData(cartEventData);
      }
    }, 100);

    return () => clearTimeout(handler);
  }, [cartEventData, debouncedCartEventData]);

  useEffect(() => {
    if (cartData) {
      const Items =
        cartData?.CartItems?.CartItem?.map((product) => {
          const price = Number(product?.LinePrice?.toFixed(2));
          return {
            discount: Number(product?.PromotionDiscount?.toFixed(2)),
            item_brand: product?.Brand || '',
            item_category: product?.ProductHierarchy1Name || '',
            item_category2: product?.ProductHierarchy2Name || '',
            item_category3: product?.MaterialGroup || '',
            item_category4: product?.CollectionName || '',
            item_category5: '',
            item_id: product?.ProductId || '',
            item_name: product?.ProductName || '',
            price: price,
            quantity: product?.Quantity,
          };
        }) || [];
      const Sampleitem =
        cartData?.Samples?.CartItem?.map((product) => {
          const price = Number(product?.LinePrice?.toFixed(2));
          return {
            discount: Number(product?.PromotionDiscount?.toFixed(2)),
            item_brand: product?.Brand || '',
            item_category: 'Sample',
            item_category2: product?.ProductHierarchy2Name || '',
            item_category3: product?.MaterialGroup || '',
            item_category4: product?.CollectionName || '',
            item_category5: '',
            item_id: product?.ProductId || '',
            item_name: product?.ProductName || '',
            price: price,
            quantity: product?.Quantity,
          };
        }) || [];

      const cartItemsforEvent = [...Items, ...Sampleitem];
      const eventData: cartItemData = {
        items: cartItemsforEvent,
        currency: 'USD',
        value: (cartData?.CartItems?.LineItemTotal + cartData?.Samples?.LineItemTotal).toFixed(2),
      };

      setCartEventData(eventData);
      if (typeof window !== 'undefined' && 'rfk' in window) {
        window.rfk.push({
          value: {
            products:
              cartItemsforEvent?.map((product) => {
                return {
                  sku: product?.item_id || '',
                  price: Number(product?.price),
                  quantity: product?.quantity,
                };
              }) || [],
          },
          type: 'status',
          name: 'cart',
        });
      }
    }
  }, [cartData]);

  useEffect(() => {
    if (debouncedCartEventData) {
      if (userEmail && userEmail !== '') {
        setTimeout(() => {
          window?.ScarabQueue?.push(['setEmail', userEmail]);
          if (cartDetailState) {
            const sampleItems = transformItems(cartDetailState?.Samples?.CartItem);
            const cartItems = transformItems(cartDetailState?.CartItems?.CartItem);
            window?.ScarabQueue.push(['cart', [...sampleItems, ...cartItems]]);
          }

          window?.ScarabQueue.push(['go']);
        }, 1000);
      }
      triggerEvent({
        event: event?.VIEW_CART,
        ecommerce: {
          currency: 'USD',
          value: Number(debouncedCartEventData?.value),
          items: debouncedCartEventData?.items,
        },
      });
    }
  }, [debouncedCartEventData]);

  if (!hasMounted) {
    return null;
  }

  return (
    <section
      key={id}
      className={cn(
        'flex flex-col gap-9 lg:gap-6 col-span-4 md:pt-10  px-5 lg:px-0',
        props?.params?.styles
      )}
    >
      {isGuestCardPending && !isAuthenticated && <LoaderSpinner />}
      {(isCartListLoading || isRemoveAllPending) && <LoaderSpinner />}
      {isCartListError || (isCartWecoError && <NotificationMessage />)}
      {isPriceUpdated && (
        <NotificationMessage
          message={t('price_update_message')}
          className="bg-yellow-50 border-yellow-200"
        />
      )}
      <SectionHeading {...props} />
      <SampleSection
        sampleSummary={props?.rendering?.fields?.SampleModalAlertSummary as Field<string>}
      />
      <ItemSection />
    </section>
  );
};

export default CartItem;

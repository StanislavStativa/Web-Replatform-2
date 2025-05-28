import { USR_EMAIL } from '@/config';
import { cartDetailAtom } from '@/core/cartStore/cartState';
import { CartData, CartItem, CartItemDetails } from '@/core/cartStore/CartStoreType';
import useLocalStorage from '@/utils/useLocalStorage';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export type CartItemDataType = { item: string; price: number; quantity: number };
export type EventData = string | [string, string | string[]] | unknown[] | CartItemDataType;

declare global {
  interface Window {
    ScarabQueue: EventData[];
  }
}

export const transformItems = (cartItems: CartData[] | undefined) => {
  return (
    cartItems?.map((item: CartData) => ({
      item: item.ProductId,
      price: Number(item.LinePrice?.toFixed(2)),
      quantity: item.Quantity,
    })) || []
  );
};

function isEventEqual(event1: EventData, event2: EventData): boolean {
  // Fast path: check for strict equality for strings and identical references
  if (event1 === event2) return true;

  // Case 1: Handle tuples [string, string | string[]]
  if (Array.isArray(event1) && Array.isArray(event2)) {
    if (event1.length !== event2.length) return false;

    // Recursively compare each element of the tuple or array
    for (let i = 0; i < event1.length; i++) {
      if (!isEventEqual(event1[i] as EventData, event2[i] as EventData)) return false;
    }
    return true;
  }

  // Case 2: Handle objects like CartItemDataType
  if (
    typeof event1 === 'object' &&
    typeof event2 === 'object' &&
    event1 !== null &&
    event2 !== null
  ) {
    const keys1 = Object.keys(event1);
    const keys2 = Object.keys(event2);

    if (keys1.length !== keys2.length) return false;

    // Compare each property in the object
    for (const key of keys1) {
      if (
        !isEventEqual(
          (event1 as unknown as Record<string, EventData>)[key],
          (event2 as unknown as Record<string, EventData>)[key]
        )
      ) {
        return false;
      }
    }
    return true;
  }

  // If the types don't match or no condition was satisfied, return false
  return false;
}

function addEvent(eventName: string, eventData?: EventData) {
  const event = eventData ? [eventName, eventData] : eventName;

  const eventExists =
    window?.ScarabQueue && window?.ScarabQueue?.some((_event) => isEventEqual(_event, event));
  if (!eventExists) {
    if (event && event?.[0] === 'cart') {
      window?.ScarabQueue?.push(event);
      window?.ScarabQueue?.push(['go']);
    } else {
      window?.ScarabQueue?.push(event);
    }
  } else {
    // console.log('Event already exists:', event);
  }
}

const EmarsysTracking = (): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const { getData } = useLocalStorage();
  const userEmail = getData<string>(USR_EMAIL);
  const userCart = getData<CartItem[]>('cartState');
  const [cartDetailState] = useAtom<CartItemDetails | null>(cartDetailAtom);
  const [isEmarysReady, setIsEmarysReady] = useState<boolean>(false);
  const [isRouteChanged, setIsRouteChanged] = useState<boolean>(false);
  const router = useRouter();
  const searchTerm = router?.asPath.includes('Search') && router.query['search'];
  const pdpPage = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return sitecoreContext?.productData?.ProductCode;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [sitecoreContext?.productData?.ProductCode]);
  const categoryPage = useMemo(() => {
    const isCategoryPage =
      sitecoreContext?.route?.templateId === 'd99a18de-5be0-4989-bf07-295cbf6054a0';
    const url = router?.asPath?.split('?')[0];
    const value = url?.split('/');
    return isCategoryPage ? value?.slice(1, value.length)?.join(' > ')?.toString() : undefined;
  }, [router.asPath, sitecoreContext?.route?.templateId]);

  useEffect(() => {
    if (
      !isEmarysReady &&
      typeof window !== 'undefined' &&
      typeof window.ScarabQueue !== 'undefined'
    ) {
      setIsEmarysReady(true);
    }
  }, [isEmarysReady]);

  useEffect(() => {
    const handleScarabQueue = () => {
      try {
        if (isEmarysReady && isRouteChanged) {
          window.ScarabQueue = window?.ScarabQueue || [];

          if (userEmail && userEmail !== '') {
            addEvent('setEmail', userEmail);

            if (searchTerm && searchTerm !== '') {
              addEvent('setSearchTerm', searchTerm);
            }

            if (categoryPage && categoryPage !== '') {
              addEvent('category', categoryPage);
            }

            if (pdpPage && pdpPage !== undefined) {
              addEvent('view', pdpPage);
            }

            if (cartDetailState) {
              const sampleItems = transformItems(cartDetailState?.Samples?.CartItem);
              const cartItems = transformItems(cartDetailState?.CartItems?.CartItem);
              addEvent('cart', [...sampleItems, ...cartItems]);
            }
          }
        }
      } catch (error) {
        // console.error('Error occurred while handling ScarabQueue:', error);
      }
    };
    const timeoutId = setTimeout(handleScarabQueue, 200); // Delay for 1 second or set your desired delay

    return () => clearTimeout(timeoutId); // Cleanup the timeout on unmount or re-render
  }, [
    router.asPath,
    userEmail,
    searchTerm,
    categoryPage,
    userCart,
    pdpPage,
    cartDetailState,
    isEmarysReady,
    isRouteChanged,
  ]);
  // Define the CustomQueue class
  class CustomQueue<T> {
    private items: T[] = [];

    // Add an item to the queue
    push(item: T): void {
      this.items.push(item);
    }

    // Remove and return the first item from the queue
    pop(): T | undefined {
      return this.items.shift();
    }

    // Clear all items from the queue
    clear(): void {
      this.items = [];
    }

    // Get a copy of the current items in the queue
    getItems(): T[] {
      return [...this.items];
    }
  }
  useEffect(() => {
    const checkChange = () => {
      // Replace the global queue with a new instance of CustomQueue
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.Queue = new CustomQueue<string>(); // Replace `string` with the desired type if needed
      setIsRouteChanged(true);
    };

    router.events.on('routeChangeComplete', checkChange);
    router.events.on('routeChangeError', checkChange);

    // Cleanup the event listeners when the component is unmounted
    return () => {
      router.events.off('routeChangeComplete', checkChange);
      router.events.off('routeChangeError', checkChange);
    };
  }, [router]);

  return <></>;
};

export default EmarsysTracking;

import cloneDeep from 'lodash.clonedeep';
import { event as eventData } from '@/config';

interface GapiSurveyOptIn {
  render: (options: {
    merchant_id: string;
    order_id: string;
    email: string;
    delivery_country: string;
    estimated_delivery_date: string;
  }) => void;
}
interface Gapi {
  load: (name: string, callback: () => void) => void;
  surveyoptin: GapiSurveyOptIn;
}

declare global {
  interface Window {
    gapi?: Gapi;
    renderOptIn?: () => void;
  }
}
type EventTrackingType = {
  [key: string]: string | string[] | number | undefined | EventTrackingType | EventTrackingType[];
};

declare global {
  interface Window {
    dataLayer: EventTrackingType[];
    eventHashes: Set<string>;
    olapicCheckout?: {
      init: (token: string) => void;
      addProduct: (id: string, price: number) => void;
      addAttribute: (key: string, value: string) => void;
      addSegment: (key: string, value: string) => void;
      execute: () => void;
    };
  }
}

export const triggerEvent = (event: EventTrackingType) => {
  window.dataLayer = window.dataLayer || [];
  window.eventHashes = window.eventHashes || new Set();

  const sanitizedEventData = cloneDeep(event); // Clone the event to sanitize the data

  const eventString = JSON.stringify(sanitizedEventData); // Stringify the event for comparison

  // Check if an identical event already exists
  if (sanitizedEventData?.event === eventData?.REMOVE_FROM_CART) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window?.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push(sanitizedEventData); // Add the actual event object to dataLayer
    window.eventHashes.add(eventString); // Track the event string to avoid duplicates
  } else if (!window.eventHashes.has(eventString)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window?.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push(sanitizedEventData); // Add the actual event object to dataLayer
    window.eventHashes.add(eventString); // Track the event string to avoid duplicates
  }
};

export const renderGCROptIn = (
  orderId: string,
  customerEmail: string,
  deliveryDate: string
): void => {
  if (typeof window !== 'undefined') {
    // Check if the Google API script is already loaded
    if (!window?.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Define the renderOptIn function
    window.renderOptIn = (): void => {
      if (window.gapi) {
        window.gapi.load('surveyoptin', () => {
          if (window.gapi)
            window.gapi.surveyoptin.render({
              merchant_id: process.env.NEXT_PUBLIC_OPT_IN_MERCHANT_ID as string,
              order_id: orderId,
              email: customerEmail,
              delivery_country: 'US', // Adjust if needed
              estimated_delivery_date: deliveryDate, // Two weeks from today
            });
        });
      }
    };
  }
};

export const renderOlapicCheckout = (
  products: { id: string; price: number }[],
  transactionId: string,
  currencyCode: string,
  segments?: { key: string; value: string }[]
): void => {
  if (typeof window === 'undefined') return;

  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[src="${process.env.NEXT_PUBLIC_OLAPIC_CHECKOUT}"]`
      );
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `${process.env.NEXT_PUBLIC_OLAPIC_CHECKOUT}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new URIError('Olapic checkout script could not be loaded'));
      document.body.appendChild(script);
    });
  };

  loadScript().then(() => {
    if (typeof window !== 'undefined' && window.olapicCheckout) {
      const olapic = window.olapicCheckout;
      olapic.init(`${process.env.NEXT_PUBLIC_OLAPIC_CHECKOUT_ID}`);

      products.forEach((product) => {
        olapic.addProduct(product.id, product.price);
      });

      olapic.addAttribute('transactionId', transactionId);
      olapic.addAttribute('currencyCode', currencyCode);

      segments?.forEach((segment) => {
        olapic.addSegment(segment.key, segment.value);
      });

      olapic.execute();
    }
  });
};

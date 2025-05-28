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
          window.gapi &&
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

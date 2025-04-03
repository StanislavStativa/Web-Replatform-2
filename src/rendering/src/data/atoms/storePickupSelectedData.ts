import { atom } from 'jotai';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storePickupSelectedData: any = atom({
  storeId: '',
  sapStoreId: '',
  storeName: '',
  address1: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  merchantId: '',
});

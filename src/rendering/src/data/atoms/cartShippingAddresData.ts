import { atom } from 'jotai';

export const cartShippingAddresData = atom({
  savedAddress: '',
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  rememberMe: false,
  shippingInstructions: '',
});

import { atom } from 'jotai';

export const creditCardEnteredData = atom({
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
  lastName: '',
  firstName: '',
  email: '',
  shipping: false,
  billing: false,
  default: false,
});

export const creditCardInformation = atom({
  cardHolderName: '',
  cardNumber: '',
  month: '',
  year: '',
  CvdCode: '',
  zipCode: '',
  tokenid: '',
});
export const creditCardError = atom({
  isError: false,
  errorMessage: '',
});

export const isCreditValidationPassed = atom(false);

import * as yup from 'yup';
import { CreditCardFormErrorMessage } from './CreditCardPayment.types';

export const creditCardPaymentSchema = (errors: CreditCardFormErrorMessage) =>
  yup.object().shape({
    cardHolderName: yup.string().required(errors.Error_cardHolder_name),
    cardNumber: yup.string(),
    month: yup.string(),
    year: yup.string(),
    CvdCode: yup.string(),
    zipCode: yup
      .string()
      .required(errors.Error_zipCode)
      .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, errors.Error_zipCode),
  });

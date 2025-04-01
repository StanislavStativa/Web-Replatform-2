import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
export interface CreditCardPaymentProps {
  rendering?: ComponentRendering & { params: ComponentParams } & {
    fields: CreditCardPaymentFieldProps;
  };
  params?: ComponentParams;
}

export interface CreditCardPaymentFieldProps {
  Title: Field<string>;
  Description: Field<string>;
}

export interface CreditCardFormErrorMessage {
  Error_cardHolder_name: string;
  Error_cardNumber: string;
  Error_Month: string;
  Error_Year: string;
  Error_CvdCode: string;
  Error_zipCode: string;
  Error_CardValid: string;
}

export interface InputFormFieldProps {
  name: string;
  placeholder: string;
  maxLength?: number;
}

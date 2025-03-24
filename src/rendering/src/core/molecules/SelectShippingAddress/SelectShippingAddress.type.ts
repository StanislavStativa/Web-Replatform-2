import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { Control, FieldValues } from 'react-hook-form';
export interface SelectShippingAddressProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: SelectShippingAddressFieldProps;
  };
  params: ComponentParams;
}

export interface SelectShippingAddressFieldProps {
  ShippingRemarks: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
  APIEndPoint: Field<string>;
  SecondaryAPIEndPoint: Field<string>;
  StatesList: {
    fields: {
      CountryCode: Field<string>;
      StateCode: Field<string>;
      StateName: Field<string>;
    };
  }[];
}

export interface InputFormFieldProps {
  name: string;
  placeholder: string;
  control?: Control<FieldValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger?: any;
  disabled?: boolean;
  maxLength?: number;
}

export interface SelectShippingAddressFormErrorMessage {
  Error_company_name_required: string;
  Error_city_required: string;
  Error_city_alphabets: string;
  Error_address_line_1_required: string;
  Error_address_line_2_required: string;
  Error_state_required: string;
  Error_zip_code_required: string;
  Error_zip_code: string;
}
export type ITypeXp = {
  IsDefault: boolean;
  IsShipping: boolean;
  IsBilling: boolean;
};
export type ITYpeSavedAddressesData = {
  Street1: string;
  Street2: string;
  City: string;
  Zip: string;
  ID: string;
  xp: ITypeXp;
};

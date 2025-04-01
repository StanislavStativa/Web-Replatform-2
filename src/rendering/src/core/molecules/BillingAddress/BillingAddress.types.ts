import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { Control, FieldValues } from 'react-hook-form';
export interface BillingAddressProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: BillingAddressFieldProps;
  };
  params: ComponentParams;
}

export interface BillingAddressFieldProps {
  StatesList: {
    fields: {
      StateCode: Field<string>;
      CountryCode: Field<string>;
      StateName: Field<string>;
    };
  }[];
  Title: Field<string>;
}

export interface BillingAddressFormErrorMessages {
  Error_company_name_required: string;
  Error_first_name_required: string;
  Error_first_name: string;
  Error_last_name_required: string;
  Error_last_name: string;
  Error_email_required: string;
  Error_email: string;
  Error_phone_number_required: string;
  Error_phone_number: string;
  Error_city_required: string;
  Error_city_alphabets: string;
  Error_address_line_1_required: string;
  Error_address_line_2_required: string;
  Error_state_required: string;
  Error_zip_code_required: string;
  Error_zip_code: string;
  Error_Preferred_store_required: string;
}

export interface FormFieldProps {
  name: string;
  placeholder: string;
  control?: Control<FieldValues>;
}

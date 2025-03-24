import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Control, FieldValues } from 'react-hook-form';

export interface ChangePersonalDataProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ChangePersonalDataFieldProps;
  };
  params: ComponentParams;
}
export interface StoreFields {
  StoreNumber: Field<string>;
  StoreName: Field<string>;
  StateCode: Field<string>;
}
export interface StoreItem {
  fields: StoreFields;
}
export interface ChangePersonalDataFieldProps {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
  Stores: StoreItem[];
}
export interface FormFieldProps {
  name: string;
  placeholder: string;
  labelText: string;
  control?: Control<FieldValues>;
}
export interface FormErrorMessages {
  Error_first_name_required: string;
  Error_first_name: string;
  Error_last_name_required: string;
  Error_last_name: string;
  Error_email_required: string;
  Error_email: string;
  Error_phone_number_required: string;
  Error_phone_number: string;
  Error_Preferred_store_required: string;
}

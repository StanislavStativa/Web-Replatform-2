import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface BillToAddressBookProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: BillToAddressBookFieldProps;
  };
  params: ComponentParams;
}
export interface BillToAddressBookFieldProps {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
  IsBilling: ITypesValCheck;
  IsShipping: ITypesValCheck;
}
export interface ITypesAddressBookData {
  name: string;
  street: string;
  address: string;
  zip: string;
  city: string;
  id: string;
}
export interface ITypesGetAddressDetails {
  ID: string;
  Shipping: boolean;
  Billing: boolean;
  Editable: boolean;
  DateCreated: string;
  CompanyName: string;
  FirstName: string | null;
  LastName: string | null;
  Street1: string;
  Street2: string;
  City: string;
  State: string;
  Zip: string;
  Country: string;
  Phone: string;
  AddressName: string;
  xp: {
    IsDefault: boolean;
  };
}
export type ITypesValCheck = {
  value: boolean;
};
export type ITypesGetAddress = ITypesGetAddress[];

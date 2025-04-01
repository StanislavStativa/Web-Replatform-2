import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface CartItemProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: CartItemFieldProps };
  params: ComponentParams;
}
export interface CartItemFieldProps {
  GuestUserDescription: Field<string>;
  PrimaryCTA: LinkField;
  SecondaryCTA: LinkField;
  ShopNowCTA: LinkField;
  SignedUserDescription: Field<string>;
  Title: Field<string>;
}

export interface ITypesSampleSection {
  sampleSummary: Field<string>;
}

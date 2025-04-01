import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { PRODUCT_TYPE } from '../Cart/CartItemCard/CartItemCard.types';
import { CartData } from '@/core/cartStore/CartStoreType';

export const enum CTAOverlayType {
  SignIn = 'SignIn',
  MyAccount = 'MyAccount',
  Cart = 'Cart',
  FindAStore = 'FindAStore',
}

export interface IHeaderCTAOverlayProps {
  fields: IHeaderCTAOverlayFields;
  className?: string;
}

export interface IHeaderCTAOverlayFields {
  OverlayCTA: LinkField;
  OverlayCTAColor: Field<string>;
  OverlayCTASize: Field<string>;
  OverlayDescription: Field<string>;
  OverlayTitle: Field<string>;
  CTAType: Field<string>;
  OverlayLinks: IMyAccountHeaderCTAOverlayFields[];
  SampleIcon?: LinkField;
  SampleModalAlertSummary: Field<string>;
  ItemIcon?: LinkField;
}

export interface IMyAccountHeaderCTAOverlayFields {
  displayName: string;
  name: string;
  url: string;
  id: string;
  fields: {
    IsSignOutCTA: { value: boolean };
    IsPaymentCTA: { value: boolean };
    CTA: LinkField;
    IsVsibleOnlyForProUser: { value: boolean };
    IsVsibleOnlyForNT30ProUser: { value: boolean };
  };
}

export interface HeaderMyAccountProps {
  props: IMyAccountHeaderCTAOverlayFields[];
}

export interface SignInOverlayProps {
  props: IHeaderCTAOverlayFields;
  className?: string;
}
export interface CartHoverProps {
  props: IHeaderCTAOverlayFields;
}
export interface CartHoverCardProps {
  type: PRODUCT_TYPE;
  product: CartData;
  productUrl: string;
}

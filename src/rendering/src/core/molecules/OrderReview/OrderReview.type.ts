import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { LineItemsField } from '../OrderSummary/OrderSummary.type';
import { RefObject } from 'react';
export interface ITypesOrderReview {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: ITypesOrderReviewField };
  params: ComponentParams;
}
export interface ITypesOrderReviewField {
  GuestUserDescription: Field<string>;
  PrimaryCTA: LinkField;
  Description: Field<string>;
  ShopNowCTA: LinkField;
  SignedUserDescription: Field<string>;
  Title: Field<string>;
  uid: Field<string>;
  SecondaryCTA: {
    value: {
      href: string;
      title: string;
    };
  };
  CTA: {
    value: {
      href: string;
      title: string;
    };
  };
}

export type ITypesOrderReviewHeading = {
  Title: Field<string>;
  orderNumber: string;
  userEmail: string;
  Description: Field<string>;
  isShowOrder: boolean;
  onPrint: (arg: null, getContent: () => HTMLDivElement | null) => void;
  contentToPrint: RefObject<HTMLDivElement>;
  SecondaryCTA: {
    value: {
      href: string;
      title: string;
    };
  };
};

export type ITypesOrderItemCard = {
  productSku: string;
  itemName: string;
  quantity: number;
  quantityUnit: string;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
  isSample: boolean;
};
export type ITypesReviewItemDetail = {
  title: string;
  content: string;
};
export type ITypesOrderInvoiceSummary = {
  shippingCharge: number;
  subTotal: number;
  tax: number;
  orderTotal: number;
  discount: number;
};
export interface ITypesOrderReviewSummary extends ITypesOrderInvoiceSummary {
  lineItems: [];
  isShowOrder: boolean;
  shipAddress: Array<ITypeShipAddress>;
}

export type ITypesLineItems = {
  ProductSKU: string;
  ItemName: string;
  Quantity: number;
  QuantityUnit: string;
  UnitPrice: number;
  TotalPrice: number;
  ImageUrl: string;
  IsSampleProduct: boolean;
};

export interface ITypesCachedSummaryCart {
  LineItems: LineItemsField[];
  Order: {
    ID: string;
  };
}
export type ITypesShipXp = {
  IsShipping: boolean;
  StoreId?: null | string;
};
export type ITypeShipAddress = {
  AddressName: string;
  City: string;
  CompanyName: string;
  Country: string;
  FirstName: string;
  LastName: string;
  State: string;
  Street1: string;
  Street2: string;
  Zip: string;
  xp: ITypesShipXp;
  IsItemAddress: boolean;
  IsPickUpStoreAddress: boolean;
  IsSampleAddress: boolean;
};
export type ITypeITypesOrderShippingInfo = {
  shipAddress: Array<ITypeShipAddress>;
};

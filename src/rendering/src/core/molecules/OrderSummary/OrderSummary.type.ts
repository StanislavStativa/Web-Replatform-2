import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface OrderSummaryProps {
  rendering: ComponentRendering & {
    params: {
      PageName?: string;
    };
  } & {
    fields: OrderSummaryFieldProps;
  };
  params: ComponentParams;
}

export interface OrderSummaryFieldProps {
  Title: Field<string>;
  CitizenPayMessage: Field<string>;
  CTA: {
    value: {
      href: string;
      title: string;
    };
  };
  SignInLink: {
    value: {
      href: string;
      title: string;
    };
  };
}

export interface LineItemsField {
  ProductID: string;
  Quantity: number;
  Product: {
    xp: {
      SellingUOM: string;
    };
  };
}

export interface CalculateSummaryCart {
  LineItems: LineItemsField[];
  Order: {
    Subtotal: number;
    PromotionDiscount: number;
    ShippingCost: number;
    TaxCost: number;
  };
}

export interface OrderSummaryGuestProps {
  Title: Field<string>;
  isAuthenticated: boolean;
  isCtaCaps: string;
  SignInLink: {
    value: {
      href: string;
      title: string;
    };
  };
}

export interface FetchedGuestCartDataProps {
  Samples: {
    CartItem: {
      CartLineID: string;
      ProductId: string;
      ProductName: string;
      Quantity: number;
      LinePrice: number;
      LinePriceTotal: number;
      InitialPrice: number;
      InitialPriceTotal: number;
      MinQuantity: number;
      MaxQuantity: number;
      PromotionDiscountText: string;
      PromotionDiscount: number;
      SellingType: string;
      SellingText: string;
      Returnable: boolean;
      ImageUrl: string;
      ProductUrl: string;
      ReturnPolicyUrl: string | null;
    }[];
    LineItemTotal: number;
    LineItemCount: number;
  };
  CartItems: {
    CartItem: {
      CartLineID: string;
      ProductId: string;
      ProductName: string;
      Quantity: number;
      LinePrice: number;
      LinePriceTotal: number;
      InitialPrice: number;
      InitialPriceTotal: number;
      MinQuantity: number;
      MaxQuantity: number;
      PromotionDiscountText: string;
      PromotionDiscount: number;
      SellingType: string;
      SellingText: string;
      Returnable: boolean;
      ImageUrl: string;
      ProductUrl: string;
      ReturnPolicyUrl: string | null;
    }[];
    LineItemTotal: number;
    LineItemCount: number;
  };
}

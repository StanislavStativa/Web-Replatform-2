import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  LinkFieldValue,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ProductAttributesProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ProductAttributesFieldProps;
  };
  params: ComponentParams;
  fields: ProductAttributesFieldProps;
  data: ProductProps;
}

export interface ProductAttributesFieldProps {
  CitizensPayCTA: {
    value: {
      href: string;
      text: string;
    };
  };
  CheckoutCTA: {
    value: {
      href: string;
      text: string;
    };
  };
  CitizensPayImage: LinkField;
  CitizensPayText: Field<string>;
  CitizensPayLearnMoreImage: LinkField;
  SampleModalAlertSummary: RichTextField;
  PDPCalculator: {
    fields: {
      Title: TextField;
      Description: RichTextField;
      AlertSummary: RichTextField;
      OverageDropdown?: OverageDropdown[];
    };
  };
  ReturnPolicyLink: LinkField | LinkFieldValue;
  data: ProductProps;
}

export interface ProductProps {
  IsClearance: boolean;
  IsBestSeller: boolean;
  IsNewArrival: boolean;
  IsSpecialOrder: boolean;
  IsSample: boolean;
  IsSampleAvailableRetail: boolean;
  IsSampleAvailablePro: boolean;
  IsOnlinePurchasableRetail: boolean;
  IsOnlinePurchasablePro: boolean;
  SampleSKU: string;
  CalculatorMode: string;
  Colors: ProductAttributesColor[];
  SizeShape: ProductAttributesColor[];
  Finish: ProductAttributesColor[];
  Collection: ProductAttributesColor[];
  Product: ProductMainProps;
  CoveragePerBox: number;
  ImageLink: string;
  StockType: string;
  Currency: string;
  IsOnSale: boolean;
  PriceSchedule: ProductMainProps;
  SellingUOM: string;
  Brand: string;
  CollectionName: string;
  MaterialGroupName: string;
  ProductHierarchy2: string;
  ProductHierarchy1: string;
  ProductNotAvailableDescText: string;
  ProductName: string;
  SamplePriceSchedule: {
    xp: {
      ProductId: string;
    };
    PriceBreaks: ProductPriceBreaksProps[];
  };
  SampleName?: string | null;
}
export interface ProductAttributesColor {
  ProductUrl: string;
  ProductImage: string;
  ProductTitle: string;
  ProductSubTitle: string;
  IsActive: boolean;
  Enabled: boolean;
}

export type OverageDropdown = {
  fields: {
    DisplayName: { value: string };
    Value: { value: string };
    IsDefaultValue?: { value: boolean };
  };
};

export type ProductMainProps = {
  PriceBreaks: ProductPriceBreaksProps[];
  xp: ProductxpProps;
  MaxQuantity: number;
};

export type ProductxpProps = {
  ProductId: string;
  Quantity: boolean;
  Price: number;
  SalePrice: number;
};

export type ProductPriceBreaksProps = {
  Quantity: boolean;
  Price: number;
  SalePrice: number;
  ProductId: string;
};

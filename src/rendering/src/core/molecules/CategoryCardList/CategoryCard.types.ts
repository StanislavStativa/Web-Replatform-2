import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface CategoryCardListProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: CategoryCardListFieldProps & { CardList: [] };
  };
  params: ComponentParams;
}

export interface CategoryCardField {
  Title: Field<string>;
  Description: Field<string>;
  Image: Field<string>;
  CTA: LinkField;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  ImageSmartCropFormat: Field<string>;
}

export interface CategoryCardListFieldProps {
  id?: string;
  fields: CategoryCardField;
  Layout: string;
  HeadingTag: string;
  HeadingSize: string;
  CTAHoverEffect: string;
  Title?: {
    value: string;
  };
  ImageClass: string;
  isClickable: string;
  IsPinterestShow: string;
}

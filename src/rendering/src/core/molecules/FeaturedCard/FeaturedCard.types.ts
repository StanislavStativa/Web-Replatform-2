import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface FeaturedCardProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: FeaturedCardFieldProps };
  params: ComponentParams;
}
export interface FeaturedCardFieldProps {
  Title: Field<string>;
  Image: Field<string>;
  CTA: LinkField;
  Description: Field<string>;
  SubHeadline: Field<string>;
  ImageSmartCropFormat: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
}

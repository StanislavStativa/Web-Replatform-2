import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface SecondaryBannerProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: SecondaryFieldProps };
  params: ComponentParams;
}

export interface RelatedLinksItem {
  displayName: string;
  fields: {
    CTA: LinkField;
  };
  id: string;
  namr: string;
  url: string;
}

export interface SecondaryFieldProps {
  CTA: LinkField;
  SecondaryCTA: LinkField;
  Description: RichTextField;
  Title: Field<string>;
  displayName: string;
  RightColumnBackgroundColor: Field<string>;
  RightColumnTitle: Field<string>;
  RelatedLinks: RelatedLinksItem[];
  ImageSmartCropFormat: Field<string>;
  Image: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
}

import {
  TextField,
  type ComponentParams,
  type ComponentRendering,
  type Field,
  type Item,
  type LinkField,
  type RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface FooterProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: FooterField;
  };
  params: ComponentParams;
}
export interface IListProps {
  linkList: Item[];
}
export interface FooterField {
  CopyrightText: Field<string>;
  UpdateTimings: Field<string>;
  QuickLinks: FooterItems[];
  Link: LinkField;
  FormPlaceholderText: Field<string>;
  LeftDescription: RichTextField;
  RightDescription: RichTextField;
  FormBoxLink: LinkField;
  AssociationLogo: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  ImageSmartCropFormat: Field<string>;
}
export interface FooterItems {
  id: string;
  displayName: string;
  name: string;
  url: string;
  fields: FooterField;
  params: ComponentParams;
}

export type ITypesSubLinks = {
  fields: { Title: TextField; Link: LinkField };
  id: React.Key | null | undefined;
  displayName: string;
};

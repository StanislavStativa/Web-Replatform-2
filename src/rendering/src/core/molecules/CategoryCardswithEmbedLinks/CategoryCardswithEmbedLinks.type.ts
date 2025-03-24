import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface EmbedLinksProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: IFieldProps };
  params: ComponentParams;
}

export type LinkItem = {
  displayName: string;
  id: string;
  name: string;
  url: string;
  fields: {
    CTA: LinkField;
  };
};

export interface IFieldProps {
  CTA?: LinkField;
  Title?: Field<string>;
  Image?: Field<string>;
  MobileImage?: Field<string>;
  TabletImage?: Field<string>;
  Description?: RichTextField;
  Links: LinkItem[];
  expanded?: boolean;
  ImageSmartCropFormat?: Field<string>;
}

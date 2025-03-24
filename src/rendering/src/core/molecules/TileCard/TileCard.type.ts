import {
  ComponentParams,
  ComponentRendering,
  LinkField,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface TileCardProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: TileCardItems };
  params: ComponentParams;
  image: string;
  altText: string;
}

export interface TileCardItems {
  Title: TextField;
  Description: RichTextField;
  SecondaryCTA: LinkField;
  HeadingSize: string;
  Image: { value: string };
  ImageSmartCropFormat: { value: string };
}

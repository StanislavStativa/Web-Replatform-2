import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface FeaturedTilesProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: FeaturedTilesField;
    params: ComponentParams;
  };
}
export interface TilesFields {
  CTA: LinkField;
  Image: Field<string>;
  ImageSmartCropFormat: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  SubTitle: Field<string>;
  Text: Field<string>;
}
export interface Tile {
  displayName?: Field<string>;
  id?: Field<string>;
  name?: Field<string>;
  url?: Field<string>;
  fields: TilesFields;
}

export interface FeaturedTilesField {
  Title: Field<string>;
  Description: Field<string>;
  Tiles: Tile[];
  Text: Field<string>;
}

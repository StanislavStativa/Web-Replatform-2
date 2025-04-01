import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface MultiAssetBannerProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: MultiAssetBannerFields };
  params: ComponentParams;
}
export interface TilesFields {
  CTA: LinkField;
  Image: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  ImageSmartCropFormat: Field<string>;
}
export interface Tile {
  displayName?: Field<string>;
  id?: Field<string>;
  name?: Field<string>;
  url?: Field<string>;
  fields: TilesFields;
}

interface MultiAssetBannerFields {
  Title: Field<string>;
  Description: Field<string>;
  Tiles: Tile[];
  Image: Field<string>;
  ImageSmartCropFormat: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
}

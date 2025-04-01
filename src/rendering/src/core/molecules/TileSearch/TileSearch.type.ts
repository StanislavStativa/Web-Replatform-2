import { type IconType } from '@/core/atoms/Select/Select.type';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface TileSearchFieldProps {
  Title: Field<string>;
  Description: Field<string>;
  CTA: LinkField;
  Image: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  Colors: { targetItems: ColorTilesSelect[] };
  Shapes: { targetItems: ShapeTilesSelect[] };
  Materials: { targetItems: MaterialsTilesSelect[] };
  ColorLabel: Field<string>;
  ShapeLabel: Field<string>;
  MaterialLabel: Field<string>;
  DiscoverRfkId: Field<string>;
  ImageSmartCropFormat: Field<string>;
}
export interface TilesFields {
  data: {
    datasource: TileSearchFieldProps;
  };
}
export interface TargetItemField {
  filterID: Field<string>;
  filterName: Field<string>;
}

export interface ColorTilesSelect {
  FacetName: Field<string>;
  Icon?: IconType;
  url: {
    path: string;
  };
}

export interface ShapeTilesSelect {
  FacetName: Field<string>;
  Icon?: IconType;
  url: {
    path: string;
  };
}

export interface MaterialsTilesSelect {
  FacetName: Field<string>;
  Icon?: IconType;
  url: {
    path: string;
  };
}
export interface TileSearchProps {
  rendering: ComponentRendering & {
    fields: TilesFields;
  };
  params: ComponentParams;
}

export type FormDataType = {
  shape?: string;
  facet_color?: string;
  facet_material?: string;
};

export interface TileSearchFacet {
  count?: number;
  id: string;
  text: string;
  in_content: string;
}

import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ContentTileFieldProps } from '../ContentTile/ContentTile.types';

export interface ContentTileStackProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ContentTileStackFieldProps;
  };
  params: ComponentParams;
}

export interface ContentTileStackFieldProps {
  ItemList: [];
  SectionTitle: Field<string>;
}

export interface ItemList {
  displayName: string;
  fields: ContentTileFieldProps;
  id: string;
}

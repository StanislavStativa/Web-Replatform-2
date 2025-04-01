import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { type TextAndImageCardItemProps } from '../Card/Card.type';

export interface NoImageCardListProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: NoImageCardListFieldsProps;
  };
  params: ComponentParams;
}

export interface NoImageCardListFieldsProps {
  SectionTitle: Field<string>;
  Cards: NoImageCardProps[];
}

export interface NoImageCardProps {
  id: string;
  displayName: string;
  name: string;
  url: string;
  fields: TextAndImageCardItemProps;
  params: ComponentParams;
}

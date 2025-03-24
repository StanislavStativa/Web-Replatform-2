import {
  type ComponentRendering,
  type ComponentParams,
  type LinkField,
  type ImageField,
  type Field,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface AccountCategoryCardsProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: AccountCategoryFieldProps;
  };
  params: ComponentParams;
}

export interface AccountCategoryFieldProps {
  CardLists: CTAListProps[];
}

export interface CTAListProps {
  id: string;
  url: string;
  displayName: string;
  fields: CardListFieldProps;
}

export interface CardListFieldProps {
  CardList: CTAListFieldProps[];
  Icon: ImageField;
  Title: Field<string>;
  IsVsibleOnlyForProUser: LinkField;
  IsVsibleOnlyForNT30ProUser: LinkField;
}

export interface CTAListFieldProps {
  id: string;
  fields: CTAFieldProps;
}

export interface CTAFieldProps {
  CTA: LinkField;
  name: string;
  id: string;
}

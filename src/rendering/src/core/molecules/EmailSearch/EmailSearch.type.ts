import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesEmailSearch {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: ITypesEmailSearchField };
  params: ComponentParams;
}

export type ITypesEmailSearchField = {
  Title: Field<string>;
  SubTitle: Field<string>;
  Text: Field<string>;
  Description: Field<string>;
  CTA: LinkField;
};

export interface FormErrorMessages {
  Error_email_required: string;
  Error_email: string;
}

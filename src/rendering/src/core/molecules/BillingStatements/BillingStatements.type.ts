import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface ITypesBillingStatements {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesBillingStatementsFields;
  };
  params: ComponentParams;
}

export type ITypesBillingStatementsFields = {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
};

import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface ITypesPayOnAccount {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesPayOnAccountFields;
  };
  params: ComponentParams;
}

export type ITypesPayOnAccountFields = {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
};

export interface FormErrorMessages {
  Error_Registration_Amount: string;
}

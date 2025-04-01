import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesCartNavigation {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesCartNavigationFields;
  };
  params: ComponentParams;
}
export interface ITypesCartNavigationFields {
  CTA: {
    value: {
      href: string;
      title: string;
    };
  };
  SecondaryCTA: {
    value: {
      href: string;
      title: string;
    };
  };
  SignInLink: {
    value: {
      href: string;
      title: string;
    };
  };
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
}

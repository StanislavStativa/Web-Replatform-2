import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface ITypesCompanyUserList {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesCompanyUserListFields;
  };
  params: ComponentParams;
}

export type ITypesCompanyUserListFields = {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
  ChangeUserURL: LinkField;
};

export type ITypesCompanyColData = {
  email: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
  loginCounter: string;
};

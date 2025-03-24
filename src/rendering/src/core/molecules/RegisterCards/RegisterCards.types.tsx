import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
  LinkFieldValue,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface RegisterCardsProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: RegisterCardsFieldProps;
  };
  params: ComponentParams;
}
export interface ImageFields {
  value: {
    src: string;
    height: number;
    width: number;
    alt: string;
  };
}
export interface RegistrationCardFields {
  CTA: LinkField | LinkFieldValue;
  Description: Field<string>;
  Icon: ImageFields;
  SubTitle: Field<string>;
  Title: Field<string>;
}
export interface RegistrationCard {
  displayName?: Field<string>;
  fields: RegistrationCardFields;
  id?: string;
  name?: Field<string>;
  url?: Field<string>;
  params: ComponentParams;
}

export interface RegisterCardsFieldProps {
  SubTitle: Field<string>;
  Title: Field<string>;
  SubHeadline: Field<string>;
  SecondaryCTATitle: Field<string>;
  Text: Field<string>;
  RegistrationCards: RegistrationCard[];
}

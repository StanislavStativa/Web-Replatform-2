import {
  ComponentParams,
  ComponentRendering,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
export interface PaymentOptionsProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: PaymentMethodsfieldProps;
  };
  params: ComponentParams;
}

interface Fields {
  CTA: LinkField;
  ExternalProvider: Field<string>;
  ID: Field<string>;
  Order: Field<string>;
  Remarks: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
}
interface PaymentOption {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: Fields;
}
export interface PaymentMethodsfieldProps {
  PersonalUsers: PaymentOption[];
  ProUsers: PaymentOption[];
  Title: Field<string>;
  Description: Field<string>;
  CardImage: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
  DiscoverImage: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
  MastercardImage: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
  VisaImage: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
  CitizenImage: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
  InvoiceImage: {
    value: {
      src: string;
      alt: string;
      width: string;
      height: string;
    };
  };
  CTA: {
    value: {
      href: string;
    };
  };
}

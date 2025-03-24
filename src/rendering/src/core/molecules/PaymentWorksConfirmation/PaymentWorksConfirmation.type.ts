import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesPaymentWorksConfirmation {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesPaymentWorksFieldsConfirmation;
  };
  params: ComponentParams;
}
export type ITypesPaymentWorksFieldsConfirmation = {
  ConfirmationTitle: Field<string>;
  ConfirmationDescription: Field<string>;
  ConfirmationSubTitle: Field<string>;
};

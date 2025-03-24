import { ComponentParams, ComponentRendering, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesCTA {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesCTAFields;
  };
  params: ComponentParams;
}
export type ITypesCTAFields = {
  CTALink: LinkField;
};

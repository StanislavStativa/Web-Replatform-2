import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface OlapicWidgetProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: OlapicWidgetField };
  params: ComponentParams;
  scriptId?: string;
}

export interface OlapicWidgetField {
  DataInstance: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  OlapicType: Field<string>;
}

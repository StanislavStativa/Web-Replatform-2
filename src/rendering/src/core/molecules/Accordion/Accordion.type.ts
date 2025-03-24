import { ComponentParams, ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface AccordionProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: Accordion };
  params: ComponentParams;
}

export interface AccordionField {
  Title: Field<string>;
  Description: Field<string>;
  BacktoTop: Field<boolean>;
  OpenbyDefault: Field<boolean>;
}

export interface AccordionItem {
  id: string;
  displayName: string;
  name: string;
  url: string;
  fields: AccordionField;
  params: ComponentParams;
}

export interface AccordionSvgProps {
  expanded: boolean;
}

export interface Accordion {
  AccordionItem: AccordionItem[];
  Title: Field<string>;
}

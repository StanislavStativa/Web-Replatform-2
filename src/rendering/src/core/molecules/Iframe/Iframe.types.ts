import { ComponentParams, ComponentRendering, TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface IframeComponentProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: Fields };
  params: ComponentParams;
}

type Fields = {
  IFrame: { value: string };
  Title: TextField;
};

import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface PdfLinksProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: PdfLinksFieldProps;
  };
  params: ComponentParams;
}

export interface PdfLinksFieldProps {
  data: {
    datasource: {
      PDFs: {
        targetItems: Array<{
          name: {
            value: string;
          };
          Link: {
            value: Field<string>;
          };
        }>;
      };
    };
  };
}

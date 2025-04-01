import { ComponentRendering, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface BreadcrumbProps {
  rendering: ComponentRendering & {
    fields: {
      data: {
        item: BreadcrumbItem & { ancestors: BreadcrumbItem[] };
      };
    };
  };
}
export interface BreadcrumbItem {
  url: { path: string };
  name: string;
  NavigationTitle: Field<string>;
  PageTitle: Field<string>;
  HideInNavigation: Field<string>;
}

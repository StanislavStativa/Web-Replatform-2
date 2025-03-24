import { ComponentRendering, ComponentParams, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface TableOfContentProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: TableOfContentFieldProps;
  };
  params: ComponentParams;
}

export interface TableOfContentFieldProps {
  Title: Field<string>;
}

export interface TableOfContentItemProps {
  id: string;
  title: Field<string>;
  subTitleList: SubTitleListProps[];
}

export interface SubTitleListProps {
  title: Field<string>;
  id: string;
}
export type ITypesHeading = {
  tag: string;
  text: string;
  id: string;
};
export type ITypesHeadingGroup = {
  tag: string;
  text: string;
  id: string;
  subHeadings: ITypesHeading[]; // An array of subHeadings (h3)
};

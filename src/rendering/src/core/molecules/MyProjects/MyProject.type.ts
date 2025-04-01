import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesMyProjects {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesMyProjectsFields;
  };
  params: ComponentParams;
}
export interface ITypesMyProjectsFields {
  CTA: LinkField;
  CTALabel: Field<string>;
  Description: Field<string>;
  Title: Field<string>;
  Icon: LinkField;
  SubTitle: Field<string>;
}
export interface ITypesMyProjectTableData {
  projectId: string;
  projectName: string;
  id: string;
}

interface ZZCustom {
  projectId: number;
  projectName: string;
}

export interface ITypesMyProjectData {
  zzcustom: ZZCustom;
}

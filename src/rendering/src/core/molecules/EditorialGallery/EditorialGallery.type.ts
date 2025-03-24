import {
  ComponentRendering,
  ComponentParams,
  Field,
  TextField,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesEditorialGallery {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesEditorialGalleryFields;
  };
  params: ComponentParams;
}

export type ITypesJasonValue = {
  jsonValue: {
    value: string;
  };
};
export type ITypesImageArray = {
  Image: ITypesJasonValue;
  TabletImage: ITypesJasonValue;
  MobileImage: ITypesJasonValue;
};
export interface ITypesEditorialGalleryFields {
  data: {
    dataSource: {
      Description: {
        jsonValue: RichTextField;
      };
      MobileDescription: ITypesJasonValue;
      Title: {
        jsonValue: TextField;
      };
      BackgroundColor: ITypesJasonValue;
      children: {
        results: ITypesImageArray[];
      };
    };
  };
}

export type ITypesEditorialImages = {
  Image: Field<string>;
  TabletImage: Field<string>;
};
export type ITypesEditorialMobileImage = {
  MobileImage: Field<string>;
};

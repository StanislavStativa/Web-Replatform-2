import {
  ComponentParams,
  ComponentRendering,
  Field,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface NumberedImageListProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: FieldItems };
  params: ComponentParams;
}

export type FieldItems = {
  Description: RichTextField;
  Title: TextField;
  ImageCaption: RichTextField;
  TotalNumber: TextField;
  CurrentNumber: Field<number>;
  Image: { value: string };
  ImageSmartCropFormat: { value: string };
  MobileImage: { value: string };
  TabletImage: { value: string };
};

import {
  ComponentParams,
  ComponentRendering,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface VideoAssetProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: Fields };
  params: ComponentParams;
}
type Fields = {
  YoutubeVideoID: { value: string };
  Title: TextField;
  Caption: RichTextField;
  Name: TextField;
  ThumbnailUrl: TextField;
  UploadDate: TextField;
  Description: TextField;
  Duration: TextField;
};

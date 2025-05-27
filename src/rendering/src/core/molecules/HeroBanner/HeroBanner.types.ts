import {
  type ComponentRendering,
  type ComponentParams,
  type LinkField,
  type RichTextField,
  type Field,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface HeroBannerProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: HeroBannerFieldProps };
  params: ComponentParams;
  isInspirationBanner?: boolean;
}

export interface HeroBannerFieldProps {
  CTA: LinkField;
  Description: RichTextField;
  Image: Field<string>;
  ImageSmartCropFormat: Field<string>;
  MobileDescription: RichTextField;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  SecondaryCTA: LinkField;
  Title: Field<string>;
  Video: LinkField;
  Label?: Field<string>;
  MobileVideo: LinkField;
  TabletVideo: LinkField;
  EnableVideoPlayerControls: Field<boolean>;
  BackgroundColor?: Field<string>;
  TextColor: Field<string>;
  MobileTitle: Field<string>;
}

export interface ImageFormatType {
  BannerImage: Field<string>;
  ImageSmartCropFormat?: Field<string>;
  MobileImage: Field<string>;
  TabletImage: Field<string>;
  useDeviceSmartCrops?: boolean | undefined;
  deviceType?: boolean | undefined;
}

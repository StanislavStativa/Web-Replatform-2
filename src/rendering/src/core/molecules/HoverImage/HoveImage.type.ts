import {
  ComponentRendering,
  ComponentParams,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface ITypesHoverImage {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: ITypesHoverImageFields;
  };
  params: ComponentParams;
}

export interface ITypesHoverImageFields {
  DesktopHoverImageOne: Field<string>;
  DesktopHoverImageTwo: Field<string>;
  DesktopHoverImageThree: Field<string>;
  TabletHoverImageOne: Field<string>;
  TabletHoverImageTwo: Field<string>;
  TabletHoverImageThree: Field<string>;
  MobileHoverImageOne: Field<string>;
  MobileHoverImageTwo: Field<string>;
  MobileHoverImageThree: Field<string>;
  DesktopImageOne: Field<string>;
  DesktopImageTwo: Field<string>;
  DesktopImageThree: Field<string>;
  TabletImageOne: Field<string>;
  TabletImageTwo: Field<string>;
  TabletImageThree: Field<string>;
  MobileImageOne: Field<string>;
  MobileImageTwo: Field<string>;
  MobileImageThree: Field<string>;
  VideoOne: LinkField;
  VideoTwo: LinkField;
  VideoThree: LinkField;
  VideoSupportOne: Field<string>;
  VideoSupportTwo: Field<string>;
  VideoSupportThree: Field<string>;
  LinkOne: LinkField;
  LinkTwo: LinkField;
  LinkThree: LinkField;
  HideLinkOne: Field<boolean>;
  HideLinkTwo: Field<boolean>;
  HideLinkThree: Field<boolean>;
}

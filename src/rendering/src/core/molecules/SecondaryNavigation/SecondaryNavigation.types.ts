import {
  ComponentRendering,
  ComponentParams,
  LinkField,
  TextField,
  Field,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { LinkVariant } from '@/core/atoms/Link/Link.type';
import { SIZE } from '@/utils/constants';

export interface ISecondaryNavigationProps {
  selectedItem?: string | null;
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: HeaderFieldPropsExtended;
  };
  params: ComponentParams;
}

export interface HeaderFieldPropsExtended {
  MainLeftNavigation?: Navigation[];
  MainRightNavigation?: Navigation[];
}

export type INavigationType = {
  MainLeftNavigation: Navigation[];
};

export type Navigation = {
  id: string;
  fields: {
    ChildMenu: ChildMenuProps[];
    Image: Field<string>;
    ImageSmartCropFormat: Field<string>;
    CTA: LinkField;
    Description: TextField;
    NavigationType: {
      id: string;
      name: string;
      displayName: string;
    };
    Buttons: {
      id: string;
      fields: {
        CTA: LinkField;
        CTAColor: Field<LinkVariant>;
        CTASize: Field<SIZE>;
      };
    }[];
    Title?: TextField;
    PopUpTitle?: Field<string>;
    PopupImage?: Field<string>;
    MobileImage?: Field<string>;
    TabletImage?: Field<string>;
    PopUpDescription?: Field<string>;
    PopupTitleHeadingSize?: Field<string>;
    PopupTitleHeadingTag?: Field<string>;
  };
};

export type ChildMenu = {
  id: string;
  Title: TextField;
  fields: {
    CTA: LinkField;
    Title: TextField;
    Icon: { value: { src: string } };
    ChildMenu: {
      id: string;
      fields: {
        Title: TextField;
        CTA: LinkField;
      };
    }[];
  };
};

export type ChildMenuProps = {
  id: string;
  fields: {
    CTA: LinkField;
    Title: TextField;
    Image: Field<string>;
    MobileImage: Field<string>;
    TabletImage: Field<string>;
    ImageSmartCropFormat: Field<string>;
    Description: TextField;
    ChildMenu: ChildMenu[];
    Icon: { value: { src: string } };
    IsVisibleOnMobile: Field<string>;
  };
};

export interface IMainSectionProps extends ISecondaryNavigationProps {
  primaryNavigationData?: Navigation;
}

export interface ISecondarySectionProps extends ISecondaryNavigationProps {
  primaryNavigationData?: Navigation;
  secondaryNavigationData?: ChildMenuProps;
}

export interface IThirdSectionProps extends ISecondaryNavigationProps {
  secondaryNavigationData?: ChildMenuProps;
}

export interface ISecondarySectionImageView {
  primaryNavigationData?: Navigation;
  secondaryNavigationData?: ChildMenuProps;
}

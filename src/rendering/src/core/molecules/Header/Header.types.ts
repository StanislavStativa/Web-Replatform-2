import {
  type ComponentRendering,
  type ComponentParams,
  type LinkField,
  type ImageField,
  type Field,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { type SearchBarFieldProps } from '../SearchBar/SearchBar.types';
import { ChildMenu } from '../SecondaryNavigation/SecondaryNavigation.types';
import {
  IHeaderCTAOverlayFields,
  IMyAccountHeaderCTAOverlayFields,
} from '../HeaderCTAOverlay/HeaderCTAOverlay.type';

export interface HeaderProps {
  rendering: ComponentRendering & { params: ComponentParams } & { fields: HeaderFieldProps };
  params: ComponentParams;
}

export interface HeaderLogoDesktopProps {
  logo: ImageField;
  mobileLogo: ImageField;
}

export interface HeaderFieldProps {
  SearchBar: SearchBarProps;
  CTAList: CTAListProps[];
  DesktopLogo: ImageField;
  MobileLogo: ImageField;
  MainLeftNavigation?: [];
  MainRightNavigation?: [];
  DateTime: Field<string>;
  HeaderDescription: Field<string>;
  MobileDescription: Field<string>;
}
export interface MenuItem {
  displayName: string;
  id: string;
  url: string;
  name: string;
  fields: {
    CTA: LinkField;
    ChildMenu: ChildMenu[];
    Description: Field<string>;
    HideInDesktop: Field<boolean>;
    Image: ImageField;
    ImageSmartCropFormat: Field<string>;
    NavigationType: {
      id: string;
      name: string;
      displayName: string;
    };
    Title: Field<string>;
    PopUpTitle?: Field<string>;
    PopupImage?: Field<string>;
    PopUpDescription?: Field<string>;
  };
}
export interface INavMenuProps extends HeaderProps {
  menuItems: MenuItem[] | MenuItem;
  className?: string;
  ariaLabel?: string;
}
export interface SearchBarProps {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: SearchBarFieldProps;
}

export interface CTAListProps {
  id: string;
  url: string;
  displayName: string;
  fields: CTAListFieldProps;
}

export interface CTAListFieldProps extends IHeaderCTAOverlayFields {
  CTA: LinkField;
  CTAType: Field<string>;
  Icon: ImageField;
  OverlayLinks: IMyAccountHeaderCTAOverlayFields[];
  Title: Field<string>;
}

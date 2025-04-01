import { LinkField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  ChildMenu,
  ChildMenuProps,
  Navigation,
} from '../SecondaryNavigation/SecondaryNavigation.types';

export interface MobilenavigationProps {
  listData: Navigation | ChildMenuProps;
  setOpen: () => void;
  Title?: TextField;
}

export interface NavigationAccordionProps {
  id: string;
  menu?: ChildMenu;
  Title?: TextField;
  fields: {
    CTA: LinkField;
    Title?: TextField;
    Icon?: { value: { src: string } };
    ChildMenu: {
      id: string;
      fields: {
        Title: TextField;
        CTA: LinkField;
      };
    }[];
    Description: TextField;
  };
  isScroll?: boolean;
}

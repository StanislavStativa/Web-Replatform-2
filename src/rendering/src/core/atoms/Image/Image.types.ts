import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface DAMImageProps {
  id?: string;
  desktopSrc?: string;
  tabletSrc?: string;
  mobileSrc?: string;
  alt?: string;
  imageTitle?: Field<string>;
}

export interface JSSImageProps {
  field?: ImageField;
  priority?: boolean;
  editable?: boolean;
}

export interface ImageProps extends DAMImageProps, JSSImageProps {
  className?: string;
  hidePinterest?: boolean;
}

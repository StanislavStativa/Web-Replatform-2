import { LinkProps as ReactLinkProps } from '@sitecore-jss/sitecore-jss-nextjs';
import { type VariantProps } from 'class-variance-authority';
import { linkVariants } from './Link';

export enum LinkVariant {
  BLACK = 'Black',
  WHITE = 'White',
  OUTLINE = 'Outline',
  OUTLINE_WHITE = 'OutlineWhite',
  INLINE = 'Inline',
}

export interface LinkProps extends ReactLinkProps, VariantProps<typeof linkVariants> {
  className?: string;
  disabled?: boolean;
  linkTitle?: string;
  theme?: 'BLACK' | 'WHITE' | null;
  isCTATextInCaps?: string;
  isCTAHoverEffect?: boolean;
}

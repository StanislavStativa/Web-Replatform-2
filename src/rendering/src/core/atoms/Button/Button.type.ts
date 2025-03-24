import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from './Button';
import React from 'react';

export enum ButtonVariant {
  BLACK = 'Black',
  WHITE = 'White',
  OUTLINE = 'Outline',
  PRIMARY = 'Primary',
  OUTLINE_WHITE = 'OutlineWhite',
}

export interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isTypeSubmit?: boolean;
  disabled?: boolean;
  isCTATextInCaps?: string;
}

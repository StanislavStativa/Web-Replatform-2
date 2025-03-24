import React from 'react';

export interface AnchorTagProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode | string;
  className?: string;
  href?: string;
  target?: string;
}

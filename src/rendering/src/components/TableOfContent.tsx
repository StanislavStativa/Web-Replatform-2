import React from 'react';
import TableOfContent from '@/core/molecules/TableOfContent/TableOfContent';
import { type TableOfContentProps } from '@/core/molecules/TableOfContent/TableOfContent.type';

export const Default = (props: TableOfContentProps): JSX.Element => {
  return <TableOfContent {...props} />;
};

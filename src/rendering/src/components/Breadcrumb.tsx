import Breadcrumb from '@/core/molecules/Breadcrumb/Breadcrumb';
import { type BreadcrumbProps } from '@/core/molecules/Breadcrumb/Breadcrumb.type';

export const Default = (props: BreadcrumbProps): JSX.Element => {
  return <Breadcrumb {...props} />;
};

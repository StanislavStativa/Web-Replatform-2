import CartNavigation from '@/core/molecules/CartNavigation/CartNavigation';
import { ITypesCartNavigation } from '@/core/molecules/CartNavigation/CartNavigation.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
export const Default = (props: ITypesCartNavigation): JSX.Element => {
  return <CartNavigation {...props} />;
};

export default withDatasourceCheck()(Default);

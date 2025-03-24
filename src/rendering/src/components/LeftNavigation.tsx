import LeftNavigation from '@/core/molecules/LeftNavigation/LeftNavigation';
import { LeftNavigationProps } from '@/core/molecules/LeftNavigation/LeftNavigation.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: LeftNavigationProps): JSX.Element => {
  return <LeftNavigation {...props} />;
};

export default withDatasourceCheck()(Default);

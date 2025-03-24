import RewardsDashoard from '@/core/molecules/RewardsDashboard/RewardsDashboard';
import { RewardsDashboardProps } from '@/core/molecules/RewardsDashboard/RewardsDashboard.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: RewardsDashboardProps): JSX.Element => {
  return <RewardsDashoard {...props} />;
};

export default withDatasourceCheck()(Default);

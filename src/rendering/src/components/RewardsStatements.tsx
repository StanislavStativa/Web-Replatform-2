import RewardsStatements from '@/core/molecules/RewardsStatements/RewardsStatements';
import { RewardsStatementsProps } from '@/core/molecules/RewardsStatements/RewardsStatemets.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: RewardsStatementsProps): JSX.Element => {
  return <RewardsStatements {...props} />;
};

export default withDatasourceCheck()(Default);

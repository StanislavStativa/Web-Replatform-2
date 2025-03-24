import BillingStatements from '@/core/molecules/BillingStatements/BillingStatements';
import { ITypesBillingStatements } from '@/core/molecules/BillingStatements/BillingStatements.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const Default = (props: ITypesBillingStatements): JSX.Element => {
  return <BillingStatements {...props} />;
};

export default withDatasourceCheck()(Default);

import OrderSummary from '@/core/molecules/OrderSummary/OrderSummary';
import { OrderSummaryProps } from '@/core/molecules/OrderSummary/OrderSummary.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: OrderSummaryProps): JSX.Element => {
  return <OrderSummary {...props} />;
};
export default withDatasourceCheck()(Default);

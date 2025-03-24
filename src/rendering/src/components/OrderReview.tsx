import OrderReview from '@/core/molecules/OrderReview/OrderReview';
import { ITypesOrderReview } from '@/core/molecules/OrderReview/OrderReview.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
export const Default = (props: ITypesOrderReview): JSX.Element => {
  return <OrderReview {...props} />;
};

export default withDatasourceCheck()(Default);

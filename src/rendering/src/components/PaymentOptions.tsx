import PaymentOptions from '@/core/molecules/PaymentOptions/PaymentOptions';
import { PaymentOptionsProps } from '@/core/molecules/PaymentOptions/PaymentOptions.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const Default = (props: PaymentOptionsProps): JSX.Element => {
  return <PaymentOptions {...props} />;
};

export default withDatasourceCheck()(Default);

import { RegisterCards } from '@/core/molecules/RegisterCards/RegisterCards';
import { type RegisterCardsProps } from '@/core/molecules/RegisterCards/RegisterCards.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: RegisterCardsProps): JSX.Element => {
  return <RegisterCards {...props} />;
};
export default withDatasourceCheck()(Default);

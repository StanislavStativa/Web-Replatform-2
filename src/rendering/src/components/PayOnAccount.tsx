import PayOnAccount from '@/core/molecules/PayOnAccount/PayOnAccount';
import { ITypesPayOnAccount } from '@/core/molecules/PayOnAccount/PayOnAccount.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: ITypesPayOnAccount): JSX.Element => {
  return <PayOnAccount {...props} />;
};

export default withDatasourceCheck()(Default);

import { type PDPInfoProps } from '@/core/molecules/PDPInfo/PDPInfo.types';
import PDPInfo from '@/core/molecules/PDPInfo/PDPInfo';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: PDPInfoProps): JSX.Element => {
  return <PDPInfo {...props} />;
};
export default withDatasourceCheck()(Default);

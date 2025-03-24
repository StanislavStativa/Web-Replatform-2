import { ProRegistrationOptionProps } from '@/core/molecules/ProRegistrationOption/ProRegistrationOption.type';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import ProRegistrationOption from '@/core/molecules/ProRegistrationOption/ProRegistrationOption';
const Default = (props: ProRegistrationOptionProps): JSX.Element => {
  return <ProRegistrationOption {...props} />;
};
export default withDatasourceCheck()(Default);

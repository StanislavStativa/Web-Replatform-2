import RegistrationConfirmation from '@/core/molecules/RegistrationConfirmation/RegistrationConfirmation';
import { RegistrationConfirmationProps } from '@/core/molecules/RegistrationConfirmation/RegistrationConfirmation.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: RegistrationConfirmationProps): JSX.Element => {
  return <RegistrationConfirmation {...props} />;
};
export default withDatasourceCheck()(Default);

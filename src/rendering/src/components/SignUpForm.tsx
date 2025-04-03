import SignUpForm from '@/core/molecules/SignUpForm/SignUpForm';
import { SignUpFormProps } from '@/core/molecules/SignUpForm/SignUpForm.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: SignUpFormProps): JSX.Element => {
  return <SignUpForm {...props} />;
};

export default withDatasourceCheck()(Default);

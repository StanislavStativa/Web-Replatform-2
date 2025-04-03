import { SecondaryBannerProps } from '@/core/molecules/SecondaryBanner/SecondaryBanner.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import dynamic from 'next/dynamic';

const SecondaryBanner = dynamic(() => import('@/core/molecules/SecondaryBanner/SecondaryBanner'), {
  ssr: false,
  loading: () => <p></p>,
});
const Default = (props: SecondaryBannerProps): JSX.Element => {
  return <SecondaryBanner key={Date.now()} {...props} />;
};
export default withDatasourceCheck()(Default);

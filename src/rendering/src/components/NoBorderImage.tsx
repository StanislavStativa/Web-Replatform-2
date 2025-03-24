import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import type { NoBorderImageProps } from '@/core/molecules/NoBorderImage/NoBorderImage.type';
import { NoBorderImage } from '@/core/molecules/NoBorderImage/NoBorderImage';

const Default = (props: NoBorderImageProps): JSX.Element => {
  return <NoBorderImage {...props} />;
};
export default withDatasourceCheck()(Default);

import { ITypesHoverImage } from '@/core/molecules/HoverImage/HoveImage.type';
import HoverImage from '@/core/molecules/HoverImage/HoverImage';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
export const Default = (props: ITypesHoverImage): JSX.Element => {
  return <HoverImage {...props} />;
};

export default withDatasourceCheck()(Default);

import CategoryCardList from '@/core/molecules/CategoryCardList/CategoryCardList';
import { CategoryCardListProps } from '@/core/molecules/CategoryCardList/CategoryCard.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: CategoryCardListProps): JSX.Element => {
  return <CategoryCardList {...props} />;
};
export default withDatasourceCheck()(Default);

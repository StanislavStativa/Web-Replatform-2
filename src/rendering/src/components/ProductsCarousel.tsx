import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ProductsCarouselProps } from '@/core/molecules/ProductsCarousel/ProductsCarousel.type';
import ProductsCarousel from '@/core/molecules/ProductsCarousel/ProductsCarousel';

const Default = (props: ProductsCarouselProps): JSX.Element => {
  return <ProductsCarousel {...props} />;
};
export default withDatasourceCheck()(Default);

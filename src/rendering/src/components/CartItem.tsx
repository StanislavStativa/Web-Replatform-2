import CartItem from '@/core/molecules/CartItem/CartItem';
import { CartItemProps } from '@/core/molecules/CartItem/CartItem.types';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

const Default = (props: CartItemProps): JSX.Element => {
  return <CartItem {...props} />;
};

export default withDatasourceCheck()(Default);

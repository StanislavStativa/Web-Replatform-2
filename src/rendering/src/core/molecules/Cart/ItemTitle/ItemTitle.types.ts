import { PRODUCT_TYPE } from '../CartItemCard/CartItemCard.types';

export interface ItemTitleProps {
  type: PRODUCT_TYPE;
  LineItemTotal: number;
  LineItemCount: number;
  isHovered?: boolean;
  SampleModalAlertSummary?: string;
}

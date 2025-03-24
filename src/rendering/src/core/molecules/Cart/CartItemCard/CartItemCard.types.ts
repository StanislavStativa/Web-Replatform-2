export enum PRODUCT_TYPE {
  ITEM = 'Item',
  SAMPLE = 'Sample',
}

export interface CardItemProps {
  productId: string;
  type: PRODUCT_TYPE;
  productUrl: string;
  returnUrl: string;
}
export interface CardItemPriceProps {
  ActualPrice: number;
  DiscountPrice: number;
  PromotionDiscount: number;
  SellingText: string;
  PromotionDiscountText: string;
  type: PRODUCT_TYPE;
}

export interface CartItem {
  productId: string;
  quantity: number;
  isSample: boolean;
  productSKU: string;
  price?: number;
}

export interface CartItemDetails {
  Samples: CartAtomProps;
  CartItems: CartAtomProps;
}

export interface CartAtomProps {
  CartItem: Array<CartData>;
  LineItemTotal: number;
  LineItemCount: number;
}
export interface CartData {
  CartLineID: string;
  ProductId: string;
  ProductName: string;
  ProductUrl: string;
  Quantity: number;
  ImageUrl: string;
  LinePrice: number;
  LinePriceTotal: number;
  InitialPrice: number;
  InitialPriceTotal: number;
  PromotionDiscountText: string;
  SellingType: string;
  SellingText: string;
  Returnable: boolean;
  ReturnPolicyUrl: string;
  PromotionDiscount: number;
  ReadyForDisplay: boolean;
  Brand?: string;
  ProductHierarchy1Name?: string;
  ProductHierarchy2Name?: string;
  MaterialGroup?: string;
  CollectionName?: string;
  IsPriceUpdated: boolean;
}

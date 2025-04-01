export enum ClickType {
  DeleteAll = 'DeleteAll',
  Delete = 'Delete',
  Cart = 'Cart',
}
export type ITypesConfirmation = {
  handleConfirmation?: (isConfirm: boolean) => void;
};

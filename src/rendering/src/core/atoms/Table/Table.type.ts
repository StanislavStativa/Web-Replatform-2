interface Identifiable {
  id: string;
  isLockable?: boolean;
  isDeletable?: boolean;
  isLocked?: boolean;
  sku?: string;
  documentType?: string;
  status?: string;
  notUnderline?: boolean;
}

export type DataWithId<T> = T & Identifiable;
export interface ITypesTable<T> {
  data: DataWithId<T>[];
  columns: Array<{ header: string; accessor: keyof T }>;
  sortable?: boolean;
  isAction?: boolean;
  onCellClick?: (id: string, column?: keyof T, misc?: string) => void;
  clickableColumns?: Array<keyof T>;
  onDelete?: (id: string, info?: string | boolean | number) => void;
  onEdit?: (id: string, info?: string | boolean | number) => void;
  isClickableUnderLine?: boolean;
  modifyCssColumns?: Array<keyof T>;
  customColumnsStyle?: string;
  imageColumns?: (keyof T)[];
  filesColumns?: (keyof T)[];
  quantityControl?: (keyof T)[];
  getQuantity?: (id: string, value: string) => void;
  isOnlyDelete?: boolean;
  isCheckbox?: boolean;
  checkboxLabel?: string;
  isUnSelectAll?: boolean;
  isSelectAll?: boolean;
  onSelectedRowsChange?: (selectedRows: string[]) => void; // Updated type for onSelectedRowsChange

  isActionLabel?: string;
  isLock?: boolean;
  getQuantityUpdate?: (value: number, invoice: string) => void;
  isMobileClassName?: string;
  fieldCss?: string;
  isMobileCheckboxLabel?: string;
  isMobileHalFNHalf?: boolean;
}

export type ITypesQuantityInput = {
  initialQuantity: string;
  getQuantity: (value: number, invoice: string) => void;
  invoiceNumber: string;
};

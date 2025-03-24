import { IOption } from '../Select/Select.type';

export interface ITypesPagination {
  perPageList: Array<IOption>;
  currentPageSize?: string;
  getSelectedPageSize: (pageSize: number | undefined) => void;
  totalItems?: number;
  itemsPerPage?: number;
  isPaging?: boolean;
  onPageChange?: (selectedPage: number) => void;
  isDownload?: boolean;
  onDownload?: () => void;
  selectClass?: string;
  isDownloadDisabled?: boolean;
}

import { SIZE } from '@/utils/constants';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options?: Array<{ label: string; value: string | number; misc?: string }>;
  className?: string;
  variant?: SelectVariant;
  elementSize?: SIZE;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showNonSelectableDefaultOption?: boolean;
  selectDefaultValue?: string;
  optionstyle?: string;
  defaultLabel?: string;
  selected?: string;
  errorStyle?: string;
  chevRonClass?: string;
  groups?: { label: string; options: { value: string; label: string }[] }[];
  isDefaultArrow?: boolean;
  arrowSize?: boolean;
}

export enum SelectVariant {
  OUTLINED = 'outlined',
  FILLED = 'filled',
}

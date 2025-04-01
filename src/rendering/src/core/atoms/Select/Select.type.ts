import { SIZE } from '@/utils/constants';

export interface SelectProps {
  name: string;
  options: Array<{
    icon?: IconType;
    label: string;
    value: string | number;
  }>;
  className?: string;
  variant?: SelectVariant;
  size?: SIZE;
  placeholder?: string;
  image?: string;
}
export interface IconType {
  jsonValue: {
    value: {
      src: string;
    };
  };
}

export type IOption = { label: string; value: string; icon?: string };

export interface CustomSelectProps {
  options: Array<IOption>;
  selected?: string;
  onSelect?: (value: string) => void;
  className?: string;
  name?: string;
  value?: string;
  variant?: string;
  size?: string;
  item?: string;
  optionstyle?: string;
  listStyle?: string;
  defaultLabel?: string;
  type?: 'button' | 'reset' | 'submit';
}
export enum SelectVariant {
  OUTLINED = 'outlined',
  FILLED = 'filled',
}

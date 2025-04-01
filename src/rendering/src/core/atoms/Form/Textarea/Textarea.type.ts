import { SIZE } from '@/utils/constants';

export interface TextareaProps {
  name: string;
  id?: string;
  className?: string;
  variant?: TextareaVariant;
  showLabel?: boolean;
  size?: SIZE;
  placeholder?: string;
  value: string;
  labelText?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export enum TextareaVariant {
  OUTLINED = 'outlined',
  UNDERLINE = 'underline',
  FILLED = 'filled',
}

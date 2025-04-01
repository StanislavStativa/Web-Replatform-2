import { SIZE } from '@/utils/constants';

export interface InputProps {
  name: string;
  id?: string;
  className?: string;
  errorStyle?: string;
  labelStyle?: string;
  variant?: InputVariant;
  showLabel?: boolean;
  size?: SIZE;
  placeholder?: string;
  labelValue?: string;
  value: string;
  labelText?: string;
  maxLength?: number;
  onBlur?: () => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputType?: string;
  showRequiredEmailMsgBelow?: boolean;
  disabled?: boolean;
  isRequired?: boolean;
  autoCompleteOff?: boolean;
}

export enum InputVariant {
  OUTLINED = 'outlined',
  UNDERLINE = 'underline',
  FILLED = 'filled',
}

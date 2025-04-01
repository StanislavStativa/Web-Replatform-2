export interface CheckboxProps {
  id: string;
  name: string;
  className?: string;
  variant?: CheckboxVariant;
  label?: string;
  defaultTrue?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export enum CheckboxVariant {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

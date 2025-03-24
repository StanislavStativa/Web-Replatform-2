export enum LabelVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ERROR = 'error',
}
export enum Emphasis {
  LIGHT = 'light',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

export interface LabelProps {
  name?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
  variant?: string;
  emphasis?: Emphasis;
}

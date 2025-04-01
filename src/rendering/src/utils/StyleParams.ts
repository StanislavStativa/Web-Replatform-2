import { ComponentProps } from '@/lib/component-props';
import { cn } from '@/utils/cn';

export const getStyles = (props: ComponentProps) => {
  return cn(props?.params?.Styles);
};

/**
 * A React component that renders a button with customizable styles.
 *
 * @param {ButtonProps} props - The props for the button component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {string} [props.className] - Additional CSS classes to be applied to the button.
 * @param {ButtonVariant} [props.variant] - The variant of the button, which determines its color scheme.
 * @param {SIZE} [props.size] - The size of the button, which determines its padding and font size.
 * @returns {React.ReactElement} - The rendered button component.
 */

import { cva } from 'class-variance-authority';
import { ButtonProps, ButtonVariant } from './Button.type';
import { SIZE } from '@/utils/constants';
import { cn } from '@/utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center max-w-full h-max rounded-md',
  {
    variants: {
      variant: {
        [ButtonVariant.BLACK]: 'bg-dark-gray text-white hover:bg-black',
        [ButtonVariant.WHITE]: 'bg-white text-black',
        [ButtonVariant.OUTLINE]:
          'border border-dark-gray text-dark-gray hover:border-black hover:text-black hover:font-latoBold ',
        [ButtonVariant.OUTLINE_WHITE]: 'border border-white text-white',
        [ButtonVariant.PRIMARY]: ' ',
      },
      size: {
        [SIZE.XSmall]: 'py-2 px-4 text-xs',
        [SIZE.SMALL]: 'py-2 px-4 text-xs', //12px
        [SIZE.MEDIUM]: 'py-3 px-6 text-sm', //14px
        [SIZE.LARGE]: 'py-3 px-8 te xt-base', //changed 16px as per ticket 17385
      },
    },
    defaultVariants: {
      variant: ButtonVariant.BLACK,
      size: SIZE.MEDIUM,
    },
  }
);

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  size,
  isTypeSubmit = false,
  disabled,
  ...props
}) => {
  return (
    <button
      type={isTypeSubmit ? 'submit' : 'button'}
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size, className }),
        props?.isCTATextInCaps && 'uppercase',
        {
          'hover:drop-shadow-button transition-all duration-100 ease-in-out': disabled === false,
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

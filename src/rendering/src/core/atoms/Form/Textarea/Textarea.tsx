import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cva } from 'class-variance-authority';
import { TextareaVariant, type TextareaProps } from './Textarea.type';
import { cn } from '@/utils/cn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export const textareaVariants = cva('border rounded-md focus:outline-none', {
  variants: {
    variant: {
      [TextareaVariant.OUTLINED]: 'border-input-dark-gray',
      [TextareaVariant.UNDERLINE]: 'border-b-2',
      [TextareaVariant.FILLED]: 'bg-gray-100 border-transparent',
    },
    size: {
      XSmall: 'py-1 px-2 text-xs',
      Small: 'py-1 px-2 text-sm',
      Medium: 'py-2 px-3 text-base',
      Large: 'py-3 px-4 text-lg',
    },
  },
  defaultVariants: {
    variant: TextareaVariant.OUTLINED,
    size: 'Medium',
  },
});

const Textarea: React.FC<TextareaProps> = ({
  name,
  id,
  className,
  variant,
  size,
  value,
  showLabel,
  labelText,
  onChange,
  disabled,
  ...props
}) => {
  const { formState } = useFormContext();

  return (
    <>
      {showLabel && <label htmlFor={id}>{labelText}</label>}
      <textarea
        name={name}
        id={id}
        className={cn(textareaVariants({ variant, size }), className)}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {formState.errors[name] && <ErrorMessage name={name} />}
    </>
  );
};

export default Textarea;

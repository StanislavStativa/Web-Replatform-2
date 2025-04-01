import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cva } from 'class-variance-authority';
import { InputVariant, type InputProps } from './Input.type';
import { cn } from '@/utils/cn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export const inputVariants = cva('border rounded-md focus:outline-none', {
  variants: {
    variant: {
      [InputVariant.OUTLINED]: 'border-input-dark-gray',
      [InputVariant.UNDERLINE]: 'border-b-2',
      [InputVariant.FILLED]: 'bg-gray-100 border-transparent',
    },
    size: {
      XSmall: 'py-1 px-2 text-xs', //12px
      Small: 'py-1 px-2 text-sm', //14px
      Medium: 'py-3 px-3 text-base', //16px
      Large: 'py-3 px-4 text-lg',
    },
    disabled: {
      true: 'bg-tonal-gray',
      false: '',
    },
  },
  defaultVariants: {
    variant: InputVariant.OUTLINED,
    size: 'Medium',
  },
});

const Input: React.FC<InputProps> = ({
  name,
  id,
  className,
  errorStyle,
  variant,
  size,
  value,
  showLabel,
  labelText,
  labelStyle,
  inputType = 'text',
  showRequiredEmailMsgBelow = true,
  onChange,
  disabled,
  isRequired,
  autoCompleteOff,
  ...props
}) => {
  const { formState } = useFormContext();

  return (
    <>
      {showLabel && (
        <label className={cn('mb-2 block text-xs font-medium', labelStyle)}>
          {labelText}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={inputType}
        name={name}
        id={id}
        className={cn(inputVariants({ variant, size, disabled, className }))}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoCompleteOff ? 'new-password' : undefined}
        {...props}
      />

      {formState.errors[name] && showRequiredEmailMsgBelow && (
        <ErrorMessage className={errorStyle} name={name} />
      )}
    </>
  );
};

export default Input;

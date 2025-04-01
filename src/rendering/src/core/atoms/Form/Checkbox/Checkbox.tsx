import React from 'react';
import { type CheckboxProps, CheckboxVariant } from './Checkbox.type';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Label from '../Label/Label';

export const checkboxVariants = cva('border rounded-md', {
  variants: {
    variant: {
      [CheckboxVariant.DEFAULT]: 'border-gray-300 bg-white',
      [CheckboxVariant.PRIMARY]: 'border-blue-500 bg-blue-500',
      [CheckboxVariant.SECONDARY]: 'border-gray-500 bg-gray-500',
    },
  },
  defaultVariants: {
    variant: CheckboxVariant.DEFAULT,
  },
});

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  id,
  className,
  defaultTrue,
  onClick,
  variant,
  disabled,
  ...props
}) => {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={name}
        className={cn(checkboxVariants({ variant, className }))}
        defaultChecked={defaultTrue}
        onClick={onClick}
        disabled={disabled}
        {...props}
      />
      <Label htmlFor={name}>{props.label}</Label>

      {name && <ErrorMessage name={name} />}
    </>
  );
};

export default Checkbox;

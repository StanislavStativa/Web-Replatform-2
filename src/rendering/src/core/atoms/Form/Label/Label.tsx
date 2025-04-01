import React from 'react';
import { type LabelProps } from './Label.type';
import { cn } from '@/utils/cn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useFormContext } from 'react-hook-form';

const Label: React.FC<LabelProps> = ({
  name,
  className,
  children,
  variant,
  emphasis,
  ...props
}) => {
  const { formState } = useFormContext();
  const { errors } = formState;

  return (
    <>
      <label htmlFor={name} className={cn(variant, emphasis, className)} {...props}>
        {children}
      </label>

      {name && errors?.[name] && <ErrorMessage name={name} />}
    </>
  );
};

export default Label;

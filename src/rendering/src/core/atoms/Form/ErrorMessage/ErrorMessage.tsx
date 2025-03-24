import React from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { type ErrorMessageProps } from './ErrorMessage.type';
import { cn } from '@/utils/cn';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ name, className }) => {
  const { formState } = useFormContext();
  const error = formState.errors[name] as FieldError | undefined;
  const requiredErrors = Array.isArray(error?.types?.required)
    ? error?.types?.required
    : [error?.message];
  if (!error || (!error.message && !requiredErrors)) {
    return null;
  }

  return (
    <ul className={cn('text-error-red', className)}>
      {requiredErrors ? (
        requiredErrors?.map((errMsg, index) => (
          <li key={index} className="list-disc">
            {errMsg}
          </li>
        ))
      ) : (
        <li>{error.message}</li>
      )}
    </ul>
  );
};

export default ErrorMessage;

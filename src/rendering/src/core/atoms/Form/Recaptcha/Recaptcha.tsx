import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { type RecaptchaProps, type RecaptchaChangeHandler } from './Recaptcha.type';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { cn } from '@/utils/cn';

const Recaptcha: React.FC<RecaptchaProps> = ({
  name,
  className,
  errorClassName,
  getValue,
  ...props
}) => {
  const { setValue, formState } = useFormContext();

  const handleRecaptchaChange: RecaptchaChangeHandler = (value) => {
    setValue(name, value);
    if (getValue) {
      getValue(value);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ''}
        onChange={handleRecaptchaChange}
        {...props}
      />

      {formState.errors[name] && <ErrorMessage name={name} className={errorClassName} />}
    </div>
  );
};

export default Recaptcha;

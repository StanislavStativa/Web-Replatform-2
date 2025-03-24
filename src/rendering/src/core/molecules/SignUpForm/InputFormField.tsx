import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { type FormFieldProps } from '../SignIn/SignIn.types';

interface InputFormFieldProps extends FormFieldProps {
  name: 'firstName' | 'lastName' | 'email';
  maxLength?: number;
  inputType?: string;
  showLabel?: boolean;
}

const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  placeholderValue,
  inputType,
  maxLength,
  showLabel,
}) => {
  return (
    <div className="flex flex-col [&>span]:text-red-700 [&>span]:font-extrabold [&>span]:text-base [&>span]:before:content-['*']">
      <Controller
        name={name}
        render={({ field }) => (
          <Input
            id={name}
            {...field}
            inputType={inputType}
            showLabel={showLabel}
            placeholder={placeholderValue}
            maxLength={maxLength}
            className={
              'w-full border-border-gray rounded py-1.5 px-2.5 text-base font-normal leading-5 md:max-w-250 lg:w-250 focus:border-blue-400 focus:shadow-md foxus:shadow-blue-300'
            }
          />
        )}
      />
    </div>
  );
};

export default InputFormField;

import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { type FormFieldProps } from './UnsubscribeForm.types';

interface InputFormFieldProps extends FormFieldProps {
  name: 'email';
  maxLength?: number;
  inputType?: string;
}

const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  placeholderValue,
  inputType,
  maxLength,
}) => {
  return (
    <div className="flex flex-col [&>span]:text-red-700 [&>span]:font-extrabold [&>span]:text-base">
      <Controller
        name={name}
        render={({ field }) => (
          <Input
            id={name}
            {...field}
            inputType={inputType}
            showLabel={true}
            placeholder={placeholderValue}
            maxLength={maxLength}
            className={
              'w-full border-border-gray rounded py-1.5 px-2.5 text-base font-normal leading-5 focus:border-blue-400 focus:shadow-md foxus:shadow-blue-300'
            }
          />
        )}
      />
    </div>
  );
};

export default InputFormField;

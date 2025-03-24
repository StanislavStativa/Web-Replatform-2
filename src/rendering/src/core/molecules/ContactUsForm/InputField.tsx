import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { type InputFieldProps } from './ContactUsForm.type';

const InputField: React.FC<InputFieldProps> = ({
  name,
  labelValue,
  inputType,
  maxLength,
  onKeyPress,
  className,
}) => {
  return (
    <div className="flex flex-col w-full py-1.5 px-5">
      <Controller
        name={name}
        render={({ field }) => {
          return (
            <Input
              {...field}
              showLabel
              inputType={inputType}
              labelText={labelValue}
              maxLength={maxLength}
              onKeyPress={onKeyPress}
              labelStyle="text-xs font-normal mb-1 text-dark-gray"
              errorStyle="text-error-red font-extrabold text-base"
              className={`w-full border border-input-border-gray rounded shadow-input py-1.5 px-2.5 h-33 ${className}`}
            />
          );
        }}
      />
    </div>
  );
};

export default InputField;

import { type InputFieldProps } from './ScheduleConsultationForm.type';
import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { cn } from '@/utils/cn';

const InputField: React.FC<InputFieldProps> = ({
  name,
  inputType,
  maxLength,
  onBlur,
  placeholderValue,
}) => {
  return (
    <div className="flex flex-col w-full">
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => {
          const handleOnBlur = () => {
            field.onBlur();
            if (onBlur) {
              onBlur();
            }
          };
          return (
            <Input
              {...field}
              inputType={inputType}
              maxLength={maxLength}
              placeholder={placeholderValue}
              onBlur={handleOnBlur}
              errorStyle="list-item mt-1 mb-2.5 ml-5 text-error-red-200 font-normal"
              className={cn(
                'w-full h-33 border border-input-border-gray mt-2 py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none',
                error && 'border border-error-red-200 focus:border-error-red-200'
              )}
            />
          );
        }}
      />
    </div>
  );
};

export default InputField;

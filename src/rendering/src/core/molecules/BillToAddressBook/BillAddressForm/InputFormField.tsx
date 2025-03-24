import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { useI18n } from 'next-localization';
import { formatPhoneNumber } from '@/utils/phoneUtils';
import { Control, FieldValues } from 'react-hook-form';
interface InputFormFieldProps {
  name: string;
  inputType?: string;
  disabled?: boolean;
  placeholder: string;
  labelText: string;
  control?: Control<FieldValues>;
  maxLength?: number;
}
const InputFormField = ({
  name,
  placeholder,
  labelText,
  control,
  inputType,
  disabled,
  maxLength,
}: InputFormFieldProps) => {
  const { t } = useI18n();

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            placeholder={t(placeholder)}
            showLabel={true}
            inputType={inputType}
            labelText={t(labelText)}
            disabled={disabled}
            maxLength={maxLength}
            onChange={(e) => {
              if (name === 'phone') {
                field.onChange(formatPhoneNumber(e.target.value));
              } else {
                field.onChange(e.target.value);
              }
            }}
            className={`w-full border-dark-gray ${error && 'border-red-500 bg-light-red placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};
export default InputFormField;

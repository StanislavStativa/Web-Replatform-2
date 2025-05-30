import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { useI18n } from 'next-localization';
import { FormFieldProps } from '@/core/molecules/ResetPassword/ResetPassword.types';
import { formatPhoneNumber } from '@/utils/phoneUtils';
interface InputFormFieldProps extends FormFieldProps {
  name: 'firstName' | 'lastName' | 'email' | 'phoneNumber';
  inputType?: string;
  disabled?: boolean;
}
const InputFormField = ({
  name,
  placeholder,
  labelText,
  control,
  inputType,
  disabled,
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
            onChange={(e) => {
              if (name === 'phoneNumber') {
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

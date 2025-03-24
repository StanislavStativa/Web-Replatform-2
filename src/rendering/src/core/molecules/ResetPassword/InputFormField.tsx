import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { useI18n } from 'next-localization';
import { FormFieldProps } from '@/core/molecules/ResetPassword/ResetPassword.types';
interface InputFormFieldProps extends FormFieldProps {
  name: 'currentPassword' | 'newPassword' | 'repeatNewPassword';
  inputType?: string;
}
const InputFormField = ({
  name,
  placeholder,
  labelText,
  control,
  inputType,
  autoCompleteOff,
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
            autoCompleteOff={autoCompleteOff}
            className={`w-full border-dark-gray ${error && 'border-red-500 bg-light-red placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};
export default InputFormField;

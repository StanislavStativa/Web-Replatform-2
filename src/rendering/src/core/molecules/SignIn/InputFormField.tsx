import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { useI18n } from 'next-localization';
import { FormFieldProps } from '../../molecules/SignIn/SignIn.types';

interface InputFormFieldProps extends FormFieldProps {
  name: 'userName' | 'password';
  inputType?: string;
  autoCompleteOff: boolean;
}

const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  labelValue,
  placeholderValue,
  inputType,
  autoCompleteOff,
}) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-y-2">
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Input
            id={name}
            {...field}
            inputType={inputType}
            showLabel={true}
            labelValue={t(labelValue)}
            placeholder={placeholderValue}
            autoCompleteOff={autoCompleteOff}
            className={`w-full border-dark-gray ${error && 'border-red-500 bg-light-red placeholder-light-slate-red'}`}
          />
        )}
      />
    </div>
  );
};

export default InputFormField;

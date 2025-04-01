import { Controller } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import { FormFieldProps } from './ForgotPassword.types';

interface InputFormFieldProps extends FormFieldProps {
  name: 'email';
}

const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  placeholderValue,
  showRequiredEmailMsgBelow,
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Input
            id={name}
            {...field}
            placeholder={placeholderValue}
            className={`lg:w-414 ${error && !showRequiredEmailMsgBelow && 'border-red-500 bg-light-red placeholder-light-slate-red'}`}
            showRequiredEmailMsgBelow={!showRequiredEmailMsgBelow}
          />
        )}
      />
    </div>
  );
};

export default InputFormField;

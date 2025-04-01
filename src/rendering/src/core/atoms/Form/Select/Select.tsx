import { useFormContext } from 'react-hook-form';
import { cva } from 'class-variance-authority';
import { type SelectProps, SelectVariant } from './Select.type';
import { cn } from '@/utils/cn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { HiChevronDown } from 'react-icons/hi2';

export const selectVariants = cva('border rounded-md focus:outline-none', {
  variants: {
    variant: {
      [SelectVariant.OUTLINED]: 'border-input-dark-gray focus:border-2',
      [SelectVariant.FILLED]: 'bg-gray-100 border-transparent',
    },
    size: {
      XSmall: 'py-1 px-2 text-xs',
      Small: 'py-1 px-2 text-sm',
      Medium: 'py-2 px-3 text-base',
      Large: 'py-3 px-4 text-lg',
    },
    disabled: {
      true: 'bg-tonal-gray',
      false: 'bg-white',
    },
  },
  defaultVariants: {
    variant: SelectVariant.OUTLINED,
    size: 'Medium',
  },
});

const Select: React.FC<SelectProps> = ({
  name,
  options,
  groups,
  className,
  errorStyle,
  variant,
  elementSize,
  showNonSelectableDefaultOption,
  selectDefaultValue,
  disabled,
  isDefaultArrow,
  chevRonClass,
  arrowSize = false,
  ...props
}) => {
  const { formState, getValues } = useFormContext();
  return (
    <>
      <div className="relative flex items-center">
        <select
          id={name}
          name={name}
          disabled={disabled}
          aria-label={name}
          className={cn(
            selectVariants({ variant, size: elementSize, disabled, className }),
            'bg-white text-ellipsis overflow-hidden', // Add right padding to accommodate the chevron
            {
              'text-light-gray': '' === getValues()[name] || getValues()[name] === undefined,
              'appearance-none': !isDefaultArrow, // Hide the default arrow
            }
          )}
          {...props}
        >
          {showNonSelectableDefaultOption && (
            <option value="" disabled selected>
              {selectDefaultValue}
            </option>
          )}

          {groups
            ? groups.map((group, index) => (
                <optgroup className="text-black" label={group.label} key={index}>
                  {group.options.map((option, idx) => (
                    <option
                      className="text-black"
                      key={`${option.value}_${idx}`}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : options?.map((option, index) => (
                <option
                  className="text-black"
                  key={`${option.value}_${index}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
        </select>
        {!isDefaultArrow && (
          <HiChevronDown
            size={arrowSize ? 12 : 18}
            style={{ strokeWidth: disabled ? 1 : 2, color: disabled ? 'grey' : '#111c24' }}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none',
              chevRonClass
            )}
          />
        )}
      </div>
      {formState.errors[name] && <ErrorMessage className={errorStyle} name={name} />}
    </>
  );
};

export default Select;

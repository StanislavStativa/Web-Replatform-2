import { MdCreate } from 'react-icons/md';
import { IoMdCheckmark } from 'react-icons/io';
import { type StepItemProps } from './ScheduleConsultationForm.type';

const StepItem: React.FC<StepItemProps> = ({ stepNumber, currentStep, label, className }) => {
  const isActive = stepNumber === currentStep;

  return (
    <div
      className={`${className} lg:flex flex-col relative items-center p-6 outline-0 box-border h-auto  ${isActive ? 'flex' : 'hidden'} `}
    >
      <div
        className={`border border-black bg-${isActive ? 'black' : 'white'} text-${isActive ? 'white' : 'black'} rounded-full h-6 w-6 flex justify-center items-center`}
      >
        <div className={`text-${isActive ? 'base' : 'sm'} leading-6`}>
          {isActive ? (
            <MdCreate />
          ) : currentStep === 2 && stepNumber === 1 ? (
            <IoMdCheckmark />
          ) : currentStep === 2 && stepNumber === 2 ? (
            <MdCreate />
          ) : currentStep === 3 && stepNumber === 1 ? (
            <IoMdCheckmark />
          ) : currentStep === 3 && stepNumber === 2 ? (
            <IoMdCheckmark />
          ) : currentStep === 3 && stepNumber === 3 ? (
            <MdCreate />
          ) : (
            stepNumber
          )}
        </div>
      </div>
      <div className="pt-4 text-center inline-block whitespace-nowrap overflow-hidden overflow-ellipsis align-middle min-w-50">
        <div className="text-base font-normal">{label}</div>
      </div>
    </div>
  );
};

export default StepItem;

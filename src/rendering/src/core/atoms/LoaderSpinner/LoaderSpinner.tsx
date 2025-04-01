import { cn } from '@/utils/cn';

const LoaderSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'tileshop-loader-wrapper fixed inset-0 flex justify-center items-center bg-black bg-opacity-50',
        className
      )}
    >
      <div
        className="tileshop-loader-grid inline-block relative w-20 h-20"
        data-pin-no-hover="true"
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default LoaderSpinner;

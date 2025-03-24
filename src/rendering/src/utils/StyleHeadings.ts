import { cn } from '@/utils/cn';

export const getHeadingStyles = (HeadingSize: string, HeadingTag: string) => {
  return cn(
    {
      'leading-8 md:leading-58': HeadingTag === 'h1',
      'leading-7 md:leading-48': HeadingTag === 'h2',
      'leading-6 md:leading-8': HeadingTag === 'h3',
      'leading-6 md:leading-7': HeadingTag === 'h4',
      'leading-6': HeadingTag === 'h5',
      'leading-5 md:leading-5': HeadingTag === 'h6',
    },
    {
      'text-28 md:text-5xl': HeadingSize === 'h1',
      'text-2xl md:text-40': HeadingSize === 'h2',
      'text-xl md:text-32': HeadingSize === 'h3',
      'text-lg md:text-2xl': HeadingSize === 'h4',
      'text-base md:text-xl': HeadingSize === 'h5',
      'text-sm md:text-lg': HeadingSize === 'h6',
    }
  );
};

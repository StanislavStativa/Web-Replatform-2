import { ITypesTimeSlot } from '@/core/molecules/ScheduleConsultationForm/ScheduleConsultationForm.type';
import { format, parse, parseISO, isValid } from 'date-fns';
export const formatUpdatedAt = (isoDateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const date: Date = new Date(isoDateString);
  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en-US', options);
  let formattedDate: string = formatter.format(date);
  formattedDate = formattedDate.replace(',', '');

  return formattedDate;
};

export function formatDate(dateString: string): string {
  if (!dateString) {
    return '';
  }

  // Parse the date string as ISO
  const date = parseISO(dateString);

  // Check if the date is valid
  if (!isValid(date)) {
    return '';
  }

  // Format the date as MM/dd/yyyy
  return format(date, 'MM/dd/yyyy');
}

export function formatDateTypeA(dateString: string): string {
  if (!dateString) {
    return '';
  }

  // Split the input date string into its components
  const dateParts = dateString.split('/');
  if (dateParts.length !== 3) {
    return '';
  }

  const month = dateParts[0].padStart(2, '0');
  const day = dateParts[1].padStart(2, '0');
  const year = dateParts[2];

  // Check if the parsed values are valid numbers
  if (isNaN(Number(year)) || isNaN(Number(month)) || isNaN(Number(day))) {
    return '';
  }

  // Return the date in the YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}

export const checkZeroData = (date: string) => {
  // Return '' if date is empty, undefined, or null
  if (!date) {
    return '';
  }

  const parts = date?.split('/');

  // Check if the first part is '00'
  if (parts[0] === '00') {
    return '';
  }

  return date;
};

// Helper function to generate 30-minute intervals
export const generateTimeSlots = (start: string, end: string): ITypesTimeSlot[] => {
  const startDate = parse(start, 'hh:mma', new Date());
  const endDate = parse(end, 'hh:mma', new Date());
  const slots: ITypesTimeSlot[] = [];

  let current = startDate;
  while (current < endDate) {
    slots?.push({
      label: format(current, 'h:mm a'), // Format as "h:mm a" for 12-hour format with AM/PM
      value: format(current, 'h:mm a'),
    });
    current = new Date(current?.getTime() + 30 * 60 * 1000); // add 30 minutes
  }

  return slots;
};

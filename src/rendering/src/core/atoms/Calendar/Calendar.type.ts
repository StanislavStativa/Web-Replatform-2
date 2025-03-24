type FormValues = {
  [key: string]: string | number | undefined;
};
export interface ITypesCalendar {
  formMethodsValue: {
    setValue: (name: string, value: string) => void;
    getValues: (name: string) => FormValues;
  };
  name: string;
  isDateBtn?: boolean;
  wrapperStyles?: string;
  calendarStyles?: string;
  placeholderText?: string;
  isToday?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  isReset?: boolean;
  chevRonClass?: string;
  isChevron?: boolean;
}

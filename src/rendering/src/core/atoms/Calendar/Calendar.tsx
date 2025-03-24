import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { DatePickerProps } from 'react-datepicker';
import { HiArrowCircleRight, HiArrowCircleLeft } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';
import { ITypesCalendar } from './Calendar.type';
import { cn } from '@/utils/cn';
import { HiChevronDown } from 'react-icons/hi2';

const Calendar = ({
  name,
  formMethodsValue,
  isDateBtn = true,
  wrapperStyles,
  calendarStyles,
  placeholderText,
  isToday = true,
  minDate,
  maxDate,
  isReset = false,
  chevRonClass,
  isChevron = false,
}: ITypesCalendar) => {
  const { t } = useI18n();
  const datePickerRef = useRef<DatePicker>(null);
  const [startDate, setStartDate] = useState<Date | null>(isToday ? new Date() : null);

  useEffect(() => {
    if (isReset) {
      setStartDate(null);
      formMethodsValue.setValue(name, '');
    }
  }, [isReset, formMethodsValue, name]);

  useEffect(() => {
    if (!formMethodsValue.getValues(name) && startDate) {
      const dateFormat = startDate.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      formMethodsValue.setValue(name, dateFormat);
    }
  }, [formMethodsValue, name, startDate]);

  const renderCustomHeader: DatePickerProps['renderCustomHeader'] = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
  }) => (
    <div className="flex px-1 text-xs first-line h-7 items-center justify-between border py-0.5 rounded-3 border-light-gray bg-input-border-gray font-bold">
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          decreaseMonth();
        }}
      >
        <HiArrowCircleLeft className="text-base" />
      </button>
      <span className="react-datepicker__current-month !text-xs">
        {monthDate.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </span>
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          increaseMonth();
        }}
      >
        <HiArrowCircleRight className="text-base" />
      </button>
    </div>
  );

  const openDatePicker = () => {
    if (datePickerRef.current !== null && datePickerRef.current !== undefined) {
      const input = datePickerRef.current.input;
      if (input) {
        input.focus();
      }
    }
  };

  const onDateChange = (date: Date) => {
    if (date) {
      setStartDate(date);
      const dateFormat = date.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      formMethodsValue.setValue(name, dateFormat);
    } else {
      setStartDate(null);
      formMethodsValue.setValue(name, '');
    }
  };

  return (
    <>
      <div className={cn('relative', wrapperStyles)}>
        <DatePicker
          name={name}
          ref={datePickerRef}
          className={cn(
            'border rounded-md max-h-60 h-50 text-base focus:outline-none py-2 bg-white text-gray-800 px-4',
            calendarStyles
          )}
          calendarClassName="datepicker-container"
          minDate={minDate as Date}
          maxDate={maxDate as Date}
          dateFormat="MM/dd/yyyy"
          showPopperArrow={false}
          renderCustomHeader={renderCustomHeader}
          showDisabledMonthNavigation
          selected={startDate}
          onChange={onDateChange}
          placeholderText={placeholderText}
          autoComplete="off"
        />
        {isChevron && (
          <HiChevronDown
            size={18}
            style={{ strokeWidth: 2, color: '#111c24' }}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none',
              chevRonClass
            )}
          />
        )}
      </div>
      {isDateBtn && (
        <Button className="text-xs h-33 hover:font-bold px-4 mt-2" onClick={openDatePicker}>
          {t('FormLabels_Date')}
        </Button>
      )}
    </>
  );
};

export default Calendar;

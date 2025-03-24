import React, { useEffect, useRef, useState } from 'react';
import { type DatePickerFieldProps } from './ScheduleConsultationForm.type';
import DatePicker, { DatePickerProps } from 'react-datepicker';
import { HiArrowCircleRight, HiArrowCircleLeft } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@/core/atoms/Button/Button';
import { useI18n } from 'next-localization';

const DatePickerField: React.FC<DatePickerFieldProps> = (props) => {
  const { name, formMethodsValue, closedDays } = props;
  const filterDate = (date: Date) => {
    const day = date.getDay();
    return !closedDays.includes(day);
  };

  const { t } = useI18n();
  const datePickerRef = useRef<DatePicker>(null);
  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 2);
  const [startDate, setStartDate] = useState<Date>(nextDay);

  useEffect(() => {
    if (!formMethodsValue.getValues(name)) {
      const dateFormat = startDate.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      formMethodsValue.setValue(name, dateFormat);
    }
  }, [name, startDate]);

  const renderCustomHeader: DatePickerProps['renderCustomHeader'] = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
  }) => (
    <div className="flex px-1 text-xs first-line h-7 items-center justify-between border py-0.5 rounded-3 border-light-gray bg-input-border-gray font-bold">
      <button type="button" onClick={decreaseMonth}>
        <HiArrowCircleLeft className="text-base" />
      </button>
      <span className="react-datepicker__current-month !text-xs">
        {monthDate.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </span>
      <button type="button" onClick={increaseMonth}>
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
    }
  };

  return (
    <>
      <div className="w-66p">
        <DatePicker
          name={name}
          ref={datePickerRef}
          className="w-36 border h-33 border-input-border-gray mt-2 py-1.5 px-2.5 !rounded-3 text-base focus:border focus:border-cyan-blue focus:shadow-cyanBlue focus:outline-none"
          calendarClassName="datepicker-container"
          minDate={nextDay}
          excludeDates={[today]}
          dateFormat="MM/dd/yyyy"
          showPopperArrow={false}
          renderCustomHeader={renderCustomHeader}
          showDisabledMonthNavigation
          selected={startDate}
          onChange={onDateChange}
          filterDate={filterDate}
        />
      </div>
      <Button className="text-xs h-33 hover:font-bold px-4 mt-2" onClick={openDatePicker}>
        {t('FormLabels_Date')}
      </Button>
    </>
  );
};

export default DatePickerField;

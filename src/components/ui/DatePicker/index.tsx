import { TextField } from '@mui/material';
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';

export type DatePickerProps = Omit<
  DesktopDatePickerProps<Dayjs, Dayjs>,
  'renderInput' | 'value' | 'onChange'
> & {
  defaultValue?: string;
};

const DatePicker = ({ InputProps, defaultValue, ...rest }: DatePickerProps) => {
  const [eventDate, setEventDate] = useState<Dayjs | null>(
    defaultValue ? dayjs(defaultValue) : null
  );

  const eventDateRef = useRef<HTMLInputElement | null>(null);

  const handleOnChangeEventDate = (date: Dayjs | null) => {
    eventDateRef.current?.setCustomValidity('');
    setEventDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        inputFormat="YYYY/MM/DD"
        mask="____/__/__"
        value={eventDate}
        onChange={handleOnChangeEventDate}
        inputRef={eventDateRef}
        InputProps={{
          autoComplete: 'off',
          ...InputProps,
        }}
        renderInput={(p) => <TextField {...p} />}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;

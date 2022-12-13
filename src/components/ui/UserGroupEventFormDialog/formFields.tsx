import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  StackProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormEvent, useRef, useState } from 'react';
import {
  GroupEventType,
  groupEventTypeMap,
  groupEventTypes,
} from '~/types/graphql';

export type FormFieldValue = {
  id?: string;
  date: Date;
  type: GroupEventType;
  memo: string;
};

export type InputFormProps = StackProps<
  'form',
  {
    initialState?: Partial<FormFieldValue>;
    onSubmit?: (
      reason: 'create' | 'update',
      value: Omit<FormFieldValue, 'id'> & { id?: string },
      event: FormEvent<HTMLFormElement>
    ) => void;
  }
>;

const InputForm = ({
  initialState = {},
  onSubmit,
  ...rest
}: InputFormProps) => {
  const {
    id: eventId,
    date: inputDate = new Date(),
    type: inputType = groupEventTypes[0],
    memo: inputMemo = '',
  } = initialState;

  const isUpdate = !!eventId;
  const [eventDate, setEventDate] = useState(inputDate);
  const [eventType, setEventType] = useState(inputType);
  const [eventMemo, setEventMemo] = useState(inputMemo);

  const eventDateRef = useRef<HTMLInputElement | null>(null);

  const handleOnChangeEventDate = (date: dayjs.Dayjs | null) => {
    if (!date) return;

    eventDateRef.current?.setCustomValidity('');
    setEventDate(date.toDate());
  };

  const handleOnChangeEventType = (e: SelectChangeEvent<GroupEventType>) => {
    setEventType(e.target.value as GroupEventType);
  };

  const handleOnChangeEventMemo: TextFieldProps['onChange'] = (e) => {
    setEventMemo(e.currentTarget.value);
  };

  const handleOnSubmit: StackProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault();

    const isValid = () => {
      const eventDayjs = dayjs(eventDate);

      if (!eventDayjs.isValid()) {
        eventDateRef.current?.setCustomValidity('不正な日付です。');
        return false;
      }

      if (eventDayjs.isAfter(dayjs())) {
        eventDateRef.current?.setCustomValidity(
          '当バージョンでは未来日を登録することはできません。'
        );
        return false;
      }

      return true;
    };

    if (!isValid()) return;

    const formValue = {
      id: eventId,
      type: eventType,
      date: eventDate,
      memo: eventMemo,
    };

    onSubmit?.(isUpdate ? 'update' : 'create', formValue, e);
  };

  return (
    <Stack {...rest} component="form" spacing={2} onSubmit={handleOnSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="日付"
          inputFormat="YYYY/MM/DD"
          mask="____/__/__"
          autoFocus
          value={eventDate}
          disabled={isUpdate}
          onChange={handleOnChangeEventDate}
          inputRef={eventDateRef}
          InputProps={{
            name: 'date',
            autoComplete: 'off',
          }}
          renderInput={(props) => (
            <TextField
              {...props}
              required
              helperText={isUpdate || '過去のイベントのみ登録可能です。'}
            />
          )}
        />
      </LocalizationProvider>

      <FormControl fullWidth>
        <InputLabel id="eventType">イベント種別</InputLabel>
        <Select
          labelId="eventType"
          id="eventTypeSelect"
          required
          value={eventType}
          label="イベント種別"
          onChange={handleOnChangeEventType}
        >
          {Object.entries(groupEventTypeMap).map(([k, v]) => (
            <MenuItem key={k} value={k}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="イベント内容"
        name="eventMemo"
        autoComplete="off"
        multiline
        minRows={4}
        value={eventMemo}
        onChange={handleOnChangeEventMemo}
      />
    </Stack>
  );
};

export default InputForm;

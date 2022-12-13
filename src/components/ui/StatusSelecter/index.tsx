import * as React from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

const RadioButtonsGroup = () => (
  <FormControl>
    <FormLabel id="demo-radio-buttons-group-label">ステータス</FormLabel>
    <RadioGroup
      row
      aria-labelledby="demo-radio-buttons-group-label"
      defaultValue="valid"
      name="radio-buttons-group"
    >
      <FormControlLabel value="valid" control={<Radio />} label="有効" />
      <FormControlLabel value="pend" control={<Radio />} label="一時停止" />
      <FormControlLabel value="invalid" control={<Radio />} label="無効" />
    </RadioGroup>
  </FormControl>
);
export default RadioButtonsGroup;

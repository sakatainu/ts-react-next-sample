import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { uniqueId } from '~/utils/index';

export type BasicSelectorItem = {
  value: string;
  label: string;
};

export type BasicSelectorProps = SelectProps<string> & {
  items: BasicSelectorItem[];
};

const BasicSelector = ({
  label,
  items,
  defaultValue,
  ...rest
}: BasicSelectorProps) => {
  const id = useMemo(() => uniqueId(), []);
  const [selected, setSelected] = useState<string>(
    defaultValue ?? items[0].value
  );

  const handleChange = (e: SelectChangeEvent) => {
    setSelected(e.target.value);
  };

  return (
    <FormControl>
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <Select
        labelId={id}
        value={selected}
        label={label}
        onChange={handleChange}
        {...rest}
      >
        {items.map(({ label: itemLabel, value }) => (
          <MenuItem key={value} value={value}>
            {itemLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BasicSelector;

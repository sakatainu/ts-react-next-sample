import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  Menu,
  MenuItem,
  MenuProps,
  styled,
} from '@mui/material';

const StyledMenu = styled(Menu)(() => ({
  '& .MuiMenuItem-root': {
    '& .MuiCheckbox-root': {
      padding: 0,
      paddingRight: 8,
    },
    '& .MuiFormControlLabel-root': {
      marginLeft: 0,
    },
  },
}));

export type MultiSelectMenuProps = {
  entries?: {
    label: React.ReactNode;
    value: string;
  }[];
  selectedValues?: string[];
  open: MenuProps['open'];
  anchorEl?: MenuProps['anchorEl'];
  onClose?: MenuProps['onClose'];
  onChange?: CheckboxProps['onChange'];
};

const MultiSelectMenu = ({
  entries,
  selectedValues,
  open,
  anchorEl,
  onClose,
  onChange,
}: MultiSelectMenuProps) => (
  <StyledMenu open={open} anchorEl={anchorEl} elevation={4} onClose={onClose}>
    {entries?.map((v) => (
      <MenuItem key={v.value}>
        <FormControlLabel
          control={
            <Checkbox
              value={v.value}
              checked={selectedValues?.includes(v.value)}
              onChange={onChange}
            />
          }
          label={v.label}
        />
      </MenuItem>
    ))}
  </StyledMenu>
);

export default MultiSelectMenu;
